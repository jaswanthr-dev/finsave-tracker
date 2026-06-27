'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Search, Trash2, Sun, Moon, Menu } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
}

const INCOME_CATS = ['Salary', 'Business', 'Trading', 'Freelance'];
const EXPENSE_CATS = ['Food', 'Entertainment', 'Utilities', 'Rent', 'Shopping'];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
    { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
  ]);

  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], desc: '', amount: '', type: 'Income' as 'Income' | 'Expense', category: 'Salary' });

  useEffect(() => { setIsMounted(true); }, []);

  const stats = useMemo(() => {
    const bal = transactions.reduce((acc, t) => acc + t.amount, 0);
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { bal, inc, exp };
  }, [transactions]);

  const filteredData = transactions.filter(t => 
    activePage === 'DASHBOARD' ? true : 
    activePage === 'HISTORY' ? true : 
    activePage === 'INCOME' ? t.type === 'Income' : 
    t.type === 'Expense'
  );

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    setTransactions(prev => [{
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type,
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    }, ...prev]);
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`border-r p-4 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center gap-3 mb-10 ${!isSidebarOpen && 'justify-center'}`}>
            <Wallet className="text-cyan-500" />
            {isSidebarOpen && <h1 className="font-bold text-xl">FinSave</h1>}
        </div>

        <nav className="flex-1 space-y-2">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSE', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
                <button key={item.name} onClick={() => setActivePage(item.name)} 
                    className={`w-full flex items-center p-3 rounded-lg transition ${activePage === item.name ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'} ${!isSidebarOpen && 'justify-center'}`}>
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </button>
            ))}
        </nav>

        <div className="space-y-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-lg justify-center"><Menu size={20}/></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-lg justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8 text-cyan-500">{activePage}</h2>

        {activePage === 'DASHBOARD' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[ {title: 'Balance', val: stats.bal}, {title: 'Income', val: stats.inc}, {title: 'Expense', val: stats.exp} ].map((s, i) => (
                    <div key={i} className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="text-sm opacity-60">{s.title}</p>
                        <h3 className="text-2xl font-bold mt-1">₹{s.val.toLocaleString()}</h3>
                    </div>
                ))}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {activePage === 'DASHBOARD' && (
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={transactions.slice().reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff' }} />
                                <Bar dataKey="amount" fill="#06b6d4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
                
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold mb-4">Transactions</h3>
                    {filteredData.map(t => (
                        <div key={t.id} className="flex justify-between items-center py-3 border-b border-slate-800/50">
                            <div><p className="font-bold">{t.desc}</p><p className="text-xs opacity-50">{t.date} • {t.category}</p></div>
                            <span className={`font-bold ${t.amount > 0 ? 'text-cyan-500' : 'text-red-500'}`}>{t.amount > 0 ? '+' : ''}₹{t.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <div className={`p-6 rounded-xl border h-fit ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold mb-6 flex items-center gap-2"><PlusCircle className="text-cyan-500"/> New Entry</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Description" className="w-full p-3 bg-transparent border rounded-lg" onChange={e => setFormData({...formData, desc: e.target.value})} />
                    <input type="number" placeholder="Amount" className="w-full p-3 bg-transparent border rounded-lg" onChange={e => setFormData({...formData, amount: e.target.value})} />
                    <select className="w-full p-3 bg-transparent border rounded-lg" onChange={e => setFormData({...formData, type: e.target.value as any, category: e.target.value === 'Income' ? 'Salary' : 'Food'})}>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <select className="w-full p-3 bg-transparent border rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {(formData.type === 'Income' ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={addTransaction} className="w-full bg-cyan-500 text-white p-3 rounded-lg font-bold">Save</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}