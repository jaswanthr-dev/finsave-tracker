'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Trash2 } from 'lucide-react';

interface Transaction { id: number; date: string; desc: string; amount: number; type: 'Income' | 'Expense'; category: string; }

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
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income' as 'Income' | 'Expense', category: 'Salary' });

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
        { id: 11, date: '2026-06-29', desc: 'Client Bonus', amount: 5000, type: 'Income', category: 'Bonus' },
        { id: 12, date: '2026-06-29', desc: 'Weekend Getaway', amount: -12000, type: 'Expense', category: 'Entertainment' },
      ]);
    }
    setIsMounted(true);
  }, []);

  const stats = useMemo(() => {
    const bal = transactions.reduce((acc, t) => acc + t.amount, 0);
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { bal, inc, exp };
  }, [transactions]);

  const filteredData = transactions.filter(t => activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense');

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTransactions = [{ id: Date.now(), ...formData, amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) }, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('finSaveData', JSON.stringify(newTransactions));
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`p-8 rounded-3xl w-full max-w-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Clear all data?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 p-3 rounded-xl hover:bg-slate-500/10">No</button>
              <button onClick={() => { localStorage.removeItem('finSaveData'); window.location.reload(); }} className="flex-1 p-3 bg-red-500 text-white rounded-xl">Yes</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`border-r h-screen sticky top-0 py-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center px-6 mb-12"><Wallet className="text-cyan-500" size={28} /> {isSidebarOpen && <span className="ml-3 font-bold text-xl">FinSave</span>}</div>
        <nav className="flex flex-col gap-y-2 px-3">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className="flex items-center p-3 rounded-xl hover:bg-slate-500/10">
              <div className="w-10 flex justify-center"><item.icon size={20} className={activePage === item.name ? 'text-cyan-500' : ''}/></div>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-3 pt-6 border-t border-slate-500/10">
          <button onClick={() => setShowConfirmModal(true)} className="flex items-center p-3 text-red-500 w-full"><Trash2 size={20}/>{isSidebarOpen && <span className="ml-3">Clear Data</span>}</button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center p-3 w-full"><Menu size={20}/></button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">{activePage}</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">Balance <h3 className="text-3xl font-bold">₹{stats.bal.toLocaleString()}</h3></div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">Income <h3 className="text-3xl font-bold text-emerald-500">₹{stats.inc.toLocaleString()}</h3></div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">Expenses <h3 className="text-3xl font-bold text-red-500">₹{stats.exp.toLocaleString()}</h3></div>
        </div>

        <div className="h-64 mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactions}><CartesianGrid stroke="#334155" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#06b6d4" /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold mb-4">Transactions</h3>
          {filteredData.map(t => <div key={t.id} className="flex justify-between py-3 border-b border-slate-800">{t.desc} <span className={t.amount > 0 ? 'text-emerald-500' : 'text-red-500'}>₹{t.amount.toLocaleString()}</span></div>)}
        </div>
      </main>
    </div>
  );
}