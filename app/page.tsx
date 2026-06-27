'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, TrendingUp, TrendingDown, History, PlusCircle, Wallet } from 'lucide-react';

// Define the shape of a transaction
interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: string;
  category: string;
}

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-01', desc: 'Monthly Salary', amount: 45000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-05', desc: 'Grocery Shopping', amount: -3200, type: 'Expense', category: 'Food' },
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finsave-data');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    }
    return INITIAL_DATA;
  });

  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    desc: '', 
    amount: '', 
    type: 'Income', 
    category: 'Salary' 
  });

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

  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { total, income, expense };
  }, [transactions]);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10"><Wallet className="text-blue-500" /> <h1 className="text-2xl font-black">FinSave</h1></div>
        <nav className="space-y-4">
          <button onClick={() => setActivePage('DASHBOARD')} className="w-full flex items-center gap-3 p-3 bg-blue-600 rounded-xl"><LayoutDashboard size={20}/> DASHBOARD</button>
          <button className="w-full flex items-center gap-3 p-3 text-slate-400"><TrendingUp size={20}/> INCOME</button>
          <button className="w-full flex items-center gap-3 p-3 text-slate-400"><TrendingDown size={20}/> EXPENSES</button>
          <button className="w-full flex items-center gap-3 p-3 text-slate-400"><History size={20}/> HISTORY</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">FinSave - {activePage}</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Total Balance</p>
            <h3 className="text-3xl font-bold">₹{stats.total.toLocaleString()}</h3>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Total Income</p>
            <h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-sm opacity-70">Total Expenses</p>
            <h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactions}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-blue-500" /> New Entry</h3>
            <input type="date" className="w-full p-3 mb-3 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date} />
            <input type="text" placeholder="Description" className="w-full p-3 mb-3 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
            <input type="number" placeholder="Amount (₹)" className="w-full p-3 mb-3 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
            <select className="w-full p-3 mb-4 bg-slate-950 border border-slate-700 rounded-xl" onChange={(e) => setFormData({...formData, type: e.target.value})} value={formData.type}>
              <option>Income</option><option>Expense</option>
            </select>
            <button onClick={addTransaction} className="w-full bg-blue-600 p-3 rounded-xl font-bold hover:bg-blue-500 transition">Save Transaction</button>
          </div>
        </div>
      </main>
    </div>
  );
}