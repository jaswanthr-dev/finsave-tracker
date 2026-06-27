'use client';
import { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: string;
  category: string;
}

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finSaveData');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { if (isMounted) localStorage.setItem('finSaveData', JSON.stringify(transactions)); }, [transactions, isMounted]);

  // CALCULATE DYNAMIC TOTALS
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [transactions]);

  if (!isMounted) return null;

  // RENDER DYNAMIC HEADER
  const renderHeaderStats = () => {
    if (activePage === 'DASHBOARD') return (
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-3xl border bg-slate-900 border-slate-800"><p className="text-sm opacity-70">Balance</p><h3 className="text-3xl font-bold">₹{stats.balance.toLocaleString()}</h3></div>
            <div className="p-6 rounded-3xl border bg-slate-900 border-slate-800"><p className="text-sm opacity-70 text-green-500">Income</p><h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3></div>
            <div className="p-6 rounded-3xl border bg-slate-900 border-slate-800"><p className="text-sm opacity-70 text-red-500">Expenses</p><h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3></div>
        </div>
    );
    if (activePage === 'INCOME') return (
        <div className="p-6 mb-8 rounded-3xl border border-green-500/30 bg-green-900/10">
            <p className="text-sm opacity-70 text-green-500">Total Income Earned</p>
            <h3 className="text-4xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3>
        </div>
    );
    if (activePage === 'EXPENSES') return (
        <div className="p-6 mb-8 rounded-3xl border border-red-500/30 bg-red-900/10">
            <p className="text-sm opacity-70 text-red-500">Total Expenses Incurred</p>
            <h3 className="text-4xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3>
        </div>
    );
    return null;
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar ... (Use the same structure as before) */}
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-extrabold text-blue-500 mb-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">FinSave - {activePage}</h2>
        {renderHeaderStats()}
        {/* Main Content Area ... */}
      </main>
    </div>
  );
}