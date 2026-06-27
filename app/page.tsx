'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Inbox } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Trading', 'Investments', 'Business', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'General'];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ date: '', desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('finSaveData');
    if (saved) setTransactions(JSON.parse(saved));
    setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem('finSaveData', JSON.stringify(transactions));
  }, [transactions, isMounted]);

  const currentCategories = formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const stats = useMemo(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { total, income, expense };
  }, [transactions]);

  const addTransaction = () => {
    if (!formData.date || !formData.desc || !formData.amount) return;
    setTransactions(prev => [...prev, { 
      id: Date.now(), 
      ...formData, 
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) 
    }]);
    setFormData(prev => ({ ...prev, desc: '', amount: '', category: formData.type === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] }));
  };

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
        <div className="flex items-center gap-4 mb-10 h-10 overflow-hidden">
          <Wallet size={24} className="text-blue-500 shrink-0" />
          {isSidebarOpen && <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">FinSave</h1>}
        </div>
        <nav className="space-y-4 flex-1">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} 
              className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start gap-4' : 'justify-center'} ${activePage === item.name ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20} className="shrink-0"/> {isSidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-4xl font-extrabold text-blue-600 mb-8">FinSave - {activePage}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-6 rounded-3xl border ${cardClass}`}>
            <table className="w-full text-left">
              <thead><tr className="text-xs uppercase border-b opacity-60"><th className="pb-4">Date</th><th className="pb-4">Desc</th><th className="pb-4">Category</th><th className="pb-4 text-right">Amount</th></tr></thead>
              <tbody>{filteredTransactions.map(t => (
                <tr key={t.id} className="border-b opacity-80"><td className="py-4">{t.date}</td><td className="py-4">{t.desc}</td><td className="py-4">{t.category}</td>
                <td className={`py-4 text-right font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>{t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}</td></tr>
              ))}</tbody>
            </table>
          </div>

          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><PlusCircle className="text-blue-500" /> New Entry</h3>
            <div className="space-y-4">
              <input type="date" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date} />
              <input type="text" placeholder="Description" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
              <input type="number" placeholder="Amount (₹)" className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
              <select className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, type: e.target.value, category: e.target.value === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]})} value={formData.type}>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <select className={`w-full p-4 border rounded-xl ${inputClass}`} onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
                {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button onClick={addTransaction} className="w-full bg-blue-600 p-4 rounded-xl font-bold text-white hover:bg-blue-500">Save Transaction</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}