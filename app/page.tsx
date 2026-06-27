'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon } from 'lucide-react';

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

// Example data added for Income and Expense sections
const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-26', desc: 'Freelance Web Project', amount: 15000, type: 'Income', category: 'Freelance' },
  { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
  { id: 4, date: '2026-06-28', desc: 'Electricity Bill', amount: -2100, type: 'Expense', category: 'Utilities' }
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // State saves until reload as requested
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);

  const stats = useMemo(() => {
    const balance = transactions.reduce((acc: number, t: Transaction) => acc + t.amount, 0);
    const income = transactions.filter((t: Transaction) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t: Transaction) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance, income, expense };
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

  const cardClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Area */}
      <aside className={`border-r p-6 flex flex-col transition-all ${isSidebarOpen ? 'w-64' : 'w-20'} ${cardClass}`}>
        <div className="flex items-center gap-4 mb-10 overflow-hidden h-10">
          <Wallet size={28} className="shrink-0 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
          {isSidebarOpen && <h1 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]">FinSave</h1>}
        </div>
        
        <nav className="space-y-4">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-400/10'}`}>
              <item.icon size={20} className="shrink-0" /> {isSidebarOpen && <span className="ml-4">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-800/50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 text-slate-400 hover:text-cyan-400">
            <Menu size={20} className="shrink-0" /> {isSidebarOpen && <span className="ml-4">Collapse</span>}
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center p-3 text-slate-400 hover:text-cyan-400">
            {theme === 'dark' ? <Sun size={20} className="shrink-0"/> : <Moon size={20} className="shrink-0"/>} {isSidebarOpen && <span className="ml-4">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-4xl font-extrabold text-cyan-500 mb-8 drop-shadow-[0_0_4px_rgba(34,211,238,0.2)]">FinSave - {activePage}</h2>
        
        {/* Dynamic Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {activePage === 'DASHBOARD' && (
            <>
              <div className={`p-6 rounded-3xl border ${cardClass}`}><p className="opacity-70">Balance</p><h3 className="text-3xl font-bold">₹{stats.balance.toLocaleString()}</h3></div>
              <div className={`p-6 rounded-3xl border ${cardClass}`}><p className="opacity-70 text-green-500">Total Income</p><h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3></div>
              <div className={`p-6 rounded-3xl border ${cardClass}`}><p className="opacity-70 text-red-500">Total Expenses</p><h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3></div>
            </>
          )}
          {activePage === 'INCOME' && (
            <div className={`p-6 rounded-3xl border col-span-3 ${cardClass}`}><p className="opacity-70 text-green-500">Total Income</p><h3 className="text-5xl font-bold text-green-500">₹{stats.income.toLocaleString()}</h3></div>
          )}
          {activePage === 'EXPENSES' && (
            <div className={`p-6 rounded-3xl border col-span-3 ${cardClass}`}><p className="opacity-70 text-red-500">Total Expenses</p><h3 className="text-5xl font-bold text-red-500">₹{stats.expense.toLocaleString()}</h3></div>
          )}
          {activePage === 'HISTORY' && (
            <div className={`p-6 rounded-3xl border col-span-3 ${cardClass}`}><p className="opacity-70">Transaction History</p><h3 className="text-3xl font-bold">{transactions.length} Total Records</h3></div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className={`col-span-2 p-6 rounded-3xl border ${cardClass}`}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filtered}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date"/><YAxis/><Tooltip/><Bar dataKey="amount" fill="#22d3ee" radius={[4, 4, 0, 0]}/></BarChart>
            </ResponsiveContainer>

            {/* List of Examples / Transactions Below Chart */}
            <div className="mt-8 space-y-3">
               <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider mb-4">Records List</h3>
               {filtered.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-700/30 hover:bg-slate-800/20 transition">
                     <div>
                        <p className="font-bold">{t.desc}</p>
                        <p className="text-xs opacity-60">{t.date} • {t.category}</p>
                     </div>
                     <p className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                     </p>
                  </div>
               ))}
               {filtered.length === 0 && <p className="opacity-50 text-center py-4">No records found.</p>}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border h-fit sticky top-8 ${cardClass}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-cyan-500"/> New Entry</h3>
            <input type="date" className="w-full p-3 mb-3 bg-transparent border border-slate-700/50 rounded-lg" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date}/>
            
            {/* Input placeholder updated to 'Description' */}
            <input type="text" placeholder="Description" className="w-full p-3 mb-3 bg-transparent border border-slate-700/50 rounded-lg focus:border-cyan-500 outline-none" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
            
            <input type="number" placeholder="Amount (₹)" className="w-full p-3 mb-3 bg-transparent border border-slate-700/50 rounded-lg focus:border-cyan-500 outline-none" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
            <select className="w-full p-3 mb-3 bg-transparent border border-slate-700/50 rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value, category: e.target.value === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]})}>
              <option value="Income">Income</option><option value="Expense">Expense</option>
            </select>
            <select className="w-full p-3 mb-5 bg-transparent border border-slate-700/50 rounded-lg" onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
              {(formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addTransaction} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-lg font-bold transition">Save Transaction</button>
          </div>
        </div>
      </main>
    </div>
  );
}