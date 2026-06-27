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

// Example data updated to show Indian comma formatting (e.g., 1,25,000)
const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 125000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-26', desc: 'Freelance Web Project', amount: 15000, type: 'Income', category: 'Freelance' },
  { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
  { id: 4, date: '2026-06-28', desc: 'Electricity Bill', amount: -2100, type: 'Expense', category: 'Utilities' }
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);

  const stats = useMemo(() => {
    const balance = transactions.reduce((acc: number, t: Transaction) => acc + t.amount, 0);
    const income = transactions.filter((t: Transaction) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t: Transaction) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance, income, expense };
  }, [transactions]);

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

  const cardClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Area */}
      <aside className={`border-r p-6 flex flex-col transition-all ${isSidebarOpen ? 'w-64' : 'w-20'} ${cardClass}`}>
        <div className="flex items-center gap-4 mb-10 overflow-hidden h-10">
          <Wallet size={28} className="shrink-0 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
          {isSidebarOpen && <h1 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]">FinSave</h1>}
        </div>
        
        <nav className="space-y-4">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20} className="shrink-0" /> {isSidebarOpen && <span className="ml-4">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-800/50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 text-slate-400 hover:text-cyan-400">
            <Menu size={20} className="shrink-0" /> {isSidebarOpen && <span