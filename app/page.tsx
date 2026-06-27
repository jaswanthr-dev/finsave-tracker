'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Search, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
}

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-26', desc: 'Freelance Web Project', amount: 15000, type: 'Income', category: 'Freelance' },
  { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
  { id: 4, date: '2026-06-28', desc: 'Electricity Bill', amount: -2100, type: 'Expense', category: 'Utilities' },
];

export default function FinSaveDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  // Compute Stats
  const stats = useMemo(() => {
    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance, income, expense };
  }, [transactions]);

  // Filtering & Searching Logic
  const filteredTransactions = transactions.filter(t => 
    (filterType === 'All' || t.type === filterType) &&
    t.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    setTransactions(prev => [{
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type as 'Income' | 'Expense',
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    }, ...prev]);
    setFormData({ ...formData, desc: '', amount: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-500 mb-6 tracking-tight">FinSave - DASHBOARD</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[ {label: 'Balance', val: stats.balance, color: 'text-white'}, {label: 'Total Income', val: stats.income, color: 'text-cyan-500'}, {label: 'Total Expenses', val: stats.expense, color: 'text-red-500'} ].map((s, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${s.color}`}>₹{s.val.toLocaleString('en-IN')}</h3>
                </div>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Main Chart & Records */}
        <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">Activity Overview</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={transactions.slice().reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={12}/>
                        <YAxis stroke="#475569" fontSize={12}/>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '8px' }} />
                        <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Controls & Records List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">RECORDS LIST</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-500" size={16}/>
                            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500" onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 text-sm focus:outline-none focus:border-cyan-500" onChange={(e) => setFilterType(e.target.value as any)}>
                            <option value="All">All Types</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-3">
                    {filteredTransactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                            <div>
                                <p className="font-bold text-slate-200">{t.desc}</p>
                                <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${t.amount > 0 ? 'text-cyan-500' : 'text-red-500'}`}>
                                    {t.amount > 0 ? '+' : ''}₹{t.amount.toLocaleString('en-IN')}
                                </span>
                                <button onClick={() => setTransactions(transactions.filter(tr => tr.id !== t.id))} className="text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Col: Input Section */}
        <div className="lg:col-span-1">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 sticky top-6">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg"><PlusCircle size={20} className="text-cyan-500"/> New Entry</h3>
                <div className="space-y-4">
                    <input type="date" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date}/>
                    <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                    <input type="number" placeholder="Amount (₹)" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                    <select className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm" onChange={(e) => setFormData({...formData, type: e.target.value as any})}>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <button onClick={addTransaction} className="w-full bg-cyan-500 text-slate-950 p-3 rounded-lg font-bold hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition">Save Transaction</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}