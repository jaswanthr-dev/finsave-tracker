'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon } from 'lucide-react';

// Define the shape of our data to clear TypeScript errors
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

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finSaveData');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { if (isMounted) localStorage.setItem('finSaveData', JSON.stringify(transactions)); }, [transactions, isMounted]);

  const stats = useMemo(() => {
    const total = transactions.reduce((acc: number, t: Transaction) => acc + t.amount, 0);
    const income = transactions.filter((t: Transaction) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t: Transaction) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { total, income, expense };
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

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside className={`border-r p-6 transition-all ${isSidebarOpen ? 'w-64' : 'w-20'} ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
          <Wallet size={28} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          {isSidebarOpen && <h1 className="text-2xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">FinSave</h1>}
        </div>
        <nav className="space-y-4">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20}/> {isSidebarOpen && <span className="ml-4">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-4 pt-6 border-t">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 text-slate-400"><Menu size={20}/> {isSidebarOpen && <span className="ml-4">Collapse</span>}</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center p-3 text-slate-400">{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>} {isSidebarOpen && <span className="ml-4">{theme === 'dark' ? 'Light' : 'Dark'}</span>}</button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-extrabold text-blue-500 mb-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">FinSave - {activePage}</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[{l:'Balance', v:stats.total, c:''}, {l:'Income', v:stats.income, c:'text-green-500'}, {l:'Expenses', v:stats.expense, c:'text-red-500'}].map(s => (
            <div key={s.l} className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
              <p className="opacity-70">{s.l}</p><h3 className={`text-3xl font-bold ${s.c}`}>₹{s.v.toLocaleString()}</h3>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className={`col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filtered}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date"/><YAxis/><Tooltip/><Bar dataKey="amount" fill="#3b82f6"/></BarChart>
            </ResponsiveContainer>
          </div>
          <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-blue-500"/> New Entry</h3>
            <input type="date" className="w-full p-3 mb-2 bg-transparent border rounded-lg" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date}/>
            <input type="text" placeholder="Desc" className="w-full p-3 mb-2 bg-transparent border rounded-lg" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
            <input type="number" placeholder="Amount" className="w-full p-3 mb-2 bg-transparent border rounded-lg" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
            <select className="w-full p-3 mb-2 bg-transparent border rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option>Income</option><option>Expense</option>
            </select>
            <select className="w-full p-3 mb-4 bg-transparent border rounded-lg" onChange={(e) => setFormData({...formData, category: e.target.value})}>
              {(formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={addTransaction} className="w-full bg-blue-600 p-3 rounded-lg font-bold">Save</button>
          </div>
        </div>
      </main>
    </div>
  );
}