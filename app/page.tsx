'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Inbox } from 'lucide-react';

const INITIAL_DATA = [
  { id: 1, date: '2026-06-01', desc: 'Monthly Salary', amount: 45000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-05', desc: 'Grocery Shopping', amount: -3200, type: 'Expense', category: 'Food' },
  { id: 3, date: '2026-06-10', desc: 'Electricity Bill', amount: -1500, type: 'Expense', category: 'Housing' },
  { id: 4, date: '2026-06-15', desc: 'Fuel', amount: -1200, type: 'Expense', category: 'Transport' },
];

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Trading', 'Investments', 'Business', 'Rental Income', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Utilities', 'General'];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // LAZY INITIALIZATION: Reads from localStorage immediately
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finsave-data');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    }
    return INITIAL_DATA;
  });

  const [formData, setFormData] = useState({ date: '', desc: '', amount: '', type: 'Income', category: 'Salary' });

  // Handle initial state and date
  useEffect(() => {
    setIsMounted(true);
    setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('finsave-data', JSON.stringify(transactions));
      console.log("Data saved to localStorage:", transactions); // Debugging: open F12 console to see this
    }
  }, [transactions, isMounted]);

  const addTransaction = () => {
    if (!formData.date || !formData.desc || !formData.amount) return;
    setTransactions(prev => [...prev, { 
      id: Date.now(), 
      ...formData, 
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) 
    }]);
    setFormData(prev => ({ ...prev, desc: '', amount: '' }));
  };

  const currentCategories = formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { total, income, expense };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (activePage === 'DASHBOARD' || activePage === 'HISTORY') return transactions;
    if (activePage === 'INCOME') return transactions.filter(t => t.type === 'Income');
    if (activePage === 'EXPENSES') return transactions.filter(t => t.type === 'Expense');
    return transactions;
  }, [transactions, activePage]);

  if (!isMounted) return null;

  const themeClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const sidebarClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const cardClass = theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const inputClass = theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300';

  return (
    <div className={`flex min-h-screen font-sans ${themeClass}`}>
      <aside className={`border-r p-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${sidebarClass}`}>
        <div className={`flex items-center gap-4 mb-10 h-10 ${!isSidebarOpen && 'justify-center'}`}>
          <Wallet size={24} className="text-blue-500 shrink-0" />
          <h1 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>FinSave</h1>
        </div>
        <nav className="space-y-4 flex-1">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} 
              className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start gap-4' : 'justify-center'} ${activePage === item.name ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20} className="shrink-0"/> 
              <span className={isSidebarOpen ? 'block' : 'hidden'}>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <header className="mb-8"><h2 className="text-4xl font-extrabold text-blue-600">FinSave - {activePage}</h2></header>
        {activePage === 'DASHBOARD' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <p className="text-sm mb-2 opacity-70">Total Balance</p>
              <h3 className="text-3xl font-bold">₹{stats.total.toLocaleString()}</h3>
            </div>
            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <p className="text-sm mb-2 opacity-70">Total Income</p>
              <h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3>
            </div>
            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <p className="text-sm mb-2 opacity-70">Total Expenses</p>
              <h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-6 rounded-3xl border ${cardClass}`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactions}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value: any) => [`₹${value}`, 'Amount']} /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><PlusCircle className="text-blue-500" /> New Entry</h3>
            <div className="space-y-4">
              <input type="date" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date} />
              <input type="text" placeholder="Description" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
              <input type="number" placeholder="Amount (₹)" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
              <select className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, type: e.target.value})} value={formData.type}>
                <option value="Income">Income</option> <option value="Expense">Expense</option>
              </select>
              <select className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
                {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button onClick={addTransaction} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500">Save Transaction</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}