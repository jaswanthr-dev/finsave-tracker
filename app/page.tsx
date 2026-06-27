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

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-26', desc: 'Freelance Web Project', amount: 15000, type: 'Income', category: 'Freelance' },
  { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
  { id: 4, date: '2026-06-28', desc: 'Electricity Bill', amount: -2100, type: 'Expense', category: 'Utilities' },
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [formData, setFormData] = useState({ date: '2026-06-27', desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);

  const stats = useMemo(() => {
    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance, income, expense };
  }, [transactions]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTx: Transaction = {
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type as 'Income' | 'Expense',
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };
    setTransactions((prev) => [newTx, ...prev]);
    setFormData({ ...formData, desc: '', amount: '' });
  };

  const deleteTransaction = (id: number) => setTransactions(prev => prev.filter(t => t.id !== id));

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className={`border-r border-slate-800 transition-all duration-300 flex flex-col py-6 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`flex items-center mb-10 h-10 ${isSidebarOpen ? 'px-6 gap-3' : 'justify-center'}`}>
          <Wallet size={28} className="shrink-0 text-cyan-500" />
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">FinSave</h1>}
        </div>
        <nav className="flex-1 space-y-2 px-3">
            <button className="w-full flex items-center p-3 rounded-xl bg-slate-900/50 text-cyan-500">
                <LayoutDashboard size={20} />
                {isSidebarOpen && <span className="ml-4 font-medium text-sm">Dashboard</span>}
            </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-cyan-500 mb-8">FinSave - DASHBOARD</h2>
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-sm">Balance</p>
                <h3 className="text-2xl font-bold mt-1">₹{stats.balance.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-sm">Total Income</p>
                <h3 className="text-2xl font-bold mt-1 text-cyan-500">₹{stats.income.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-sm">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1 text-red-500">₹{stats.expense.toLocaleString('en-IN')}</h3>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
            {/* Left: Graph & Records */}
            <div className="col-span-2 space-y-8">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={transactions.slice().reverse()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#475569" />
                            <YAxis stroke="#475569" />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4' }} />
                            <Bar dataKey="amount" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h3 className="text-slate-400 uppercase text-xs font-bold mb-4 tracking-wider">RECORDS LIST</h3>
                    <div className="space-y-3">
                        {transactions.map((t) => (
                            <div key={t.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div>
                                    <p className="font-bold">{t.desc}</p>
                                    <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                                </div>
                                <span className={`font-bold ${t.amount > 0 ? 'text-cyan-500' : 'text-red-500'}`}>
                                    {t.amount > 0 ? '+' : ''}₹{t.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: New Entry */}
            <div className="col-span-1">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 sticky top-8">
                    <h3 className="font-bold mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-cyan-500"/> New Entry</h3>
                    <div className="space-y-4">
                        <input type="date" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" onChange={(e) => setFormData({...formData, desc: e.target.value})} />
                        <input type="number" placeholder="Amount (₹)" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                        <select className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value as any})}>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                        <button onClick={addTransaction} className="w-full bg-cyan-500 text-slate-950 p-3 rounded-lg font-bold hover:bg-cyan-400">Save Transaction</button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}