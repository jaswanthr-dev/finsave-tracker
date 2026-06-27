'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: string;
  category: string;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Trading', 'Investments', 'Business', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'General'];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finSaveData');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { if (isMounted) localStorage.setItem('finSaveData', JSON.stringify(transactions)); }, [transactions, isMounted]);

  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
    // Filtered totals for the specific active page
    const pageTotal = activePage === 'INCOME' ? income : activePage === 'EXPENSES' ? expense : total;
    return { total, income, expense, pageTotal };
  }, [transactions, activePage]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTx: Transaction = {
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type,
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };
    setTransactions(prev => [...prev, newTx]);
    setFormData(prev => ({ ...prev, desc: '', amount: '' }));
  };

  const filtered = transactions.filter((t: Transaction) => activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : (activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense'));

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar remains the same */}
      <aside className={`border-r p-6 transition-all ${isSidebarOpen ? 'w-64' : 'w-20'} ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
          <Wallet size={28} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          {isSidebarOpen && <h1 className="text-2xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">FinSave</h1>}
        </div>
        <nav className="space-y-4">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20}/> {isSidebarOpen && <span className="ml-4">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-4xl font-extrabold text-blue-500 mb-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">FinSave - {activePage}</h2>
        
        {/* Dynamic Header Stats */}
        <div className="p-6 mb-8 rounded-3xl border bg-blue-600/10 border-blue-500/20">
            <p className="opacity-70 text-sm">Total {activePage.toLowerCase()} for this period</p>
            <h3 className="text-4xl font-bold">₹{stats.pageTotal.toLocaleString()}</h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className={`col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
             <div className="space-y-4">
                {filtered.map(t => (
                    <div key={t.id} className="flex justify-between p-4 border-b border-slate-700/30">
                        <span>{t.desc} ({t.category})</span>
                        <span className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>₹{t.amount.toLocaleString()}</span>
                    </div>
                ))}
             </div>
          </div>
          {/* New Entry Form remains the same */}
          <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-blue-500"/> New Entry</h3>
            {/* ... input fields ... */}
          </div>
        </div>
      </main>
    </div>
  );
}