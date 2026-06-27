'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Inbox } from 'lucide-react';

const INITIAL_DATA = [
  { id: 1, date: '2026-06-01', desc: 'Monthly Salary', amount: 45000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-05', desc: 'Grocery Shopping', amount: -3200, type: 'Expense', category: 'Food' },
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  
  // LAZY INITIALIZATION: Keeps your data from being wiped on refresh
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finsave-data');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    }
    return INITIAL_DATA;
  });

  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('finsave-data', JSON.stringify(transactions));
    }
  }, [transactions, isMounted]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    setTransactions(prev => [...prev, { 
      id: Date.now(), 
      ...formData, 
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) 
    }]);
    setFormData(prev => ({ ...prev, desc: '', amount: '' }));
  };

  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { total, income, expense };
  }, [transactions]);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 border-r border-slate-800 p-6">
        <h1 className="text-2xl font-black text-blue-500 mb-10">FinSave</h1>
        <nav className="space-y-4">
          <button onClick={() => setActivePage('DASHBOARD')} className="w-full text-left p-2 hover:text-blue-400">Dashboard</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Total Balance</p>
            <h3 className="text-3xl font-bold">₹{stats.total.toLocaleString()}</h3>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Income</p>
            <h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Expenses</p>
            <h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactions}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">New Entry</h3>
            <input type="text" placeholder="Desc" className="w-full p-3 mb-2 bg-slate-950 rounded-lg" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
            <input type="number" placeholder="Amount" className="w-full p-3 mb-2 bg-slate-950 rounded-lg" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
            <button onClick={addTransaction} className="w-full bg-blue-600 p-3 rounded-lg font-bold">Save</button>
          </div>
        </div>
      </main>
    </div>
  );
}