'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
}

const CATEGORIES = {
  Income: ['Salary', 'Business', 'Trading', 'Freelance', 'Dividends', 'Bonus'],
  Expense: ['Food', 'Entertainment', 'Utilities', 'Rent', 'Shopping', 'Transport', 'Healthcare', 'Education']
};

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    desc: '', 
    amount: '', 
    type: 'Income' as 'Income' | 'Expense', 
    category: 'Salary' 
  });

  useEffect(() => {
    const saved = localStorage.getItem('finSaveData');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([
        { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
        { id: 2, date: '2026-06-25', desc: 'Freelance UI Design', amount: 15000, type: 'Income', category: 'Freelance' },
        { id: 3, date: '2026-06-26', desc: 'Weekly Supermarket', amount: -4800, type: 'Expense', category: 'Food' },
        { id: 4, date: '2026-06-26', desc: 'Netflix & Spotify', amount: -1200, type: 'Expense', category: 'Entertainment' },
        { id: 5, date: '2026-06-27', desc: 'Broadband Bill', amount: -1500, type: 'Expense', category: 'Utilities' },
        { id: 6, date: '2026-06-27', desc: 'Consulting Project', amount: 30000, type: 'Income', category: 'Business' },
        { id: 7, date: '2026-06-28', desc: 'Petrol/Fuel', amount: -3000, type: 'Expense', category: 'Transport' },
        { id: 8, date: '2026-06-28', desc: 'Stock Dividends', amount: 4500, type: 'Income', category: 'Dividends' },
        { id: 9, date: '2026-06-28', desc: 'New Sneakers', amount: -6500, type: 'Expense', category: 'Shopping' },
        { id: 10, date: '2026-06-28', desc: 'Gym Membership', amount: -2000, type: 'Expense', category: 'Healthcare' },
        { id: 11, date: '2026-06-28', desc: 'Online Course', amount: -3500, type: 'Expense', category: 'Education' },
      ]);
    }
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
    setIsMounted(true);
  }, []);

  const clearData = () => {
    if (window.confirm("Clear all data? Default records will return on refresh.")) {
      localStorage.removeItem('finSaveData');
      window.location.reload();
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('isDarkMode', JSON.stringify(newTheme));
  };

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTransactions = [{
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type,
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    }, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('finSaveData', JSON.stringify(newTransactions));
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar: Grid layout locks sections into rigid cells */}
      <aside className={`border-r h-screen sticky top-0 grid grid-rows-[auto_1fr_auto] py-6 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        
        {/* Header */}
        <div className="flex items-center gap-3 px-6"><Wallet className="text-cyan-500" size={28} />{isSidebarOpen && <h1 className="font-bold text-xl">FinSave</h1>}</div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-y-2 px-3 pt-10">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
                <button key={item.name} onClick={() => setActivePage(item.name)} 
                    className={`w-full flex items-center p-3 rounded-xl ${activePage === item.name ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'}`}>
                    <item.icon size={20} />{isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
                </button>
            ))}
        </nav>

        {/* Footer: Locked to bottom row of grid with generous top padding */}
        <div className="px-3 pt-20 border-t border-slate-500/20 flex flex-col gap-y-3">
            <button onClick={clearData} className={`w-full flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-xl`}>
                <Trash2 size={20} />{isSidebarOpen && <span className="ml-4 font-medium text-sm">Clear Data</span>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center"><Menu size={20}/></button>
            <button onClick={toggleTheme} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">Dashboard</h2>
        {/* Content goes here */}
      </main>
    </div>
  );
}