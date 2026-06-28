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
        { id: 10, date: '2026-06-29', desc: 'Gym Membership', amount: -2000, type: 'Expense', category: 'Healthcare' },
        { id: 11, date: '2026-06-29', desc: 'Online Course', amount: -3500, type: 'Expense', category: 'Education' },
        { id: 12, date: '2026-06-29', desc: 'Client Bonus', amount: 5000, type: 'Income', category: 'Bonus' },
        { id: 13, date: '2026-06-30', desc: 'Dinner Outing', amount: -2500, type: 'Expense', category: 'Food' },
        { id: 14, date: '2026-06-30', desc: 'Electricity Bill', amount: -2200, type: 'Expense', category: 'Utilities' },
      ]);
    }
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
    setIsMounted(true);
  }, []);

  const stats = useMemo(() => {
    const bal = transactions.reduce((acc, t) => acc + t.amount, 0);
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { bal, inc, exp };
  }, [transactions]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTransactions = [{ id: Date.now(), ...formData, amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) }, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('finSaveData', JSON.stringify(newTransactions));
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  const cards = [{ title: 'Current Balance', val: stats.bal, color: 'text-white' }, { title: 'TOTAL INCOME', val: stats.inc, color: 'text-emerald-500' }, { title: 'TOTAL EXPENSES', val: stats.exp, color: 'text-red-500' }];

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside className={`border-r h-screen sticky top-0 py-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center gap-3 px-6 mb-10 shrink-0 ${!isSidebarOpen && 'justify-center px-0'}`}>
            <Wallet className="text-cyan-500" size={28} /> {isSidebarOpen && <h1 className="font-bold text-xl">FinSave</h1>}
        </div>
        <nav className="flex-1 flex flex-col gap-y-2 px-3">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
                <button key={item.name} onClick={() => setActivePage(item.name)} className={`flex items-center p-3 rounded-xl ${activePage === item.name ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'}`}>
                    <item.icon size={20} /> {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
                </button>
            ))}
        </nav>
        <div className="shrink-0 px-3 pt-6 border-t border-slate-500/20 flex flex-col gap-y-3">
            <button onClick={() => setShowConfirmModal(true)} className="flex items-center p-3 text-red-500"><Trash2 size={20}/>{isSidebarOpen && <span className="ml-4">Clear All Data</span>}</button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center p-3 justify-center"><Menu size={20}/></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center p-3 justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">FinSave - {activePage}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((s, i) => <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-sm opacity-70">{s.title}</p><h3 className={`text-4xl font-extrabold mt-2 ${s.color}`}>₹{Math.abs(s.val).toLocaleString()}</h3></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={transactions.slice().reverse()}><CartesianGrid stroke="#334155" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#06b6d4" /></BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    {transactions.map(t => <div key={t.id} className="flex justify-between py-3 border-b border-slate-800">{t.desc} <span className={t.amount > 0 ? 'text-emerald-500' : 'text-red-500'}>₹{t.amount.toLocaleString()}</span></div>)}
                </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 h-fit">
                <h3 className="font-bold mb-6">New Entry</h3>
                <input type="text" placeholder="Desc" className="w-full p-3 mb-4 bg-slate-950 rounded-xl" onChange={e => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                <input type="number" placeholder="Amt" className="w-full p-3 mb-4 bg-slate-950 rounded-xl" onChange={e => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                <button onClick={addTransaction} className="w-full bg-cyan-500 p-3 rounded-xl font-bold">Save</button>
            </div>
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="p-8 rounded-3xl w-full max-w-sm bg-slate-900 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Clear all data?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 p-3 rounded-xl hover:bg-slate-700">No</button>
              <button onClick={() => { localStorage.removeItem('finSaveData'); window.location.reload(); }} className="flex-1 p-3 bg-red-500 rounded-xl font-bold">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}