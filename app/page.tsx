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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('isDarkMode', JSON.stringify(newTheme));
  };

  const stats = useMemo(() => {
    const bal = transactions.reduce((acc, t) => acc + t.amount, 0);
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { bal, inc, exp };
  }, [transactions]);

  const filteredData = transactions.filter(t => 
    activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : 
    activePage === 'INCOME' ? t.type === 'Income' : 
    activePage === 'EXPENSES' ? t.type === 'Expense' : true
  );

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

  const inputStyle = `w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-500 transition-colors ${
    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
  }`;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar - Isolated from the Modal */}
      <aside className={`border-r transition-all duration-300 will-change-[width] h-screen sticky top-0 py-6 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center gap-3 px-6 mb-10 shrink-0 ${!isSidebarOpen && 'justify-center px-0'}`}>
            <Wallet className="text-cyan-500 shrink-0" size={28} />
            {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight">FinSave</h1>}
        </div>
        
        <nav className="flex-1 flex flex-col gap-y-2 px-3">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
                <button key={item.name} onClick={() => setActivePage(item.name)} 
                    className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'} ${!isSidebarOpen && 'justify-center'}`}>
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
                </button>
            ))}
        </nav>

        <div className="shrink-0 px-3 pt-6 border-t border-slate-500/20 flex flex-col gap-y-3">
            <button onClick={() => setShowConfirmModal(true)} className={`w-full flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition ${!isSidebarOpen ? 'justify-center' : 'justify-start'}`}>
                <Trash2 size={20} className="shrink-0" />
                {isSidebarOpen && <span className="ml-4 font-medium text-sm whitespace-nowrap">Clear All Data</span>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center"><Menu size={20}/></button>
            <button onClick={toggleTheme} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard Content remains the same ... */}
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">FinSave - {activePage}</h2>
        {/* ... (Omitted for brevity, paste your chart/data code here) ... */}
      </main>

      {/* Professional Modal - Kept separate at the bottom to preserve Sidebar performance */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`p-8 rounded-3xl w-full max-w-sm border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-bold mb-2">Delete all data?</h3>
            <p className="opacity-70 text-sm mb-8">This action is permanent and cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 p-3 rounded-xl font-bold hover:bg-slate-500/10">Cancel</button>
              <button onClick={() => { localStorage.removeItem('finSaveData'); window.location.reload(); }} className="flex-1 p-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}