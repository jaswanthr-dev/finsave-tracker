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

  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    desc: '', 
    amount: '', 
    type: 'Income' as 'Income' | 'Expense', 
    category: 'Salary' 
  });

  useEffect(() => {
    const saved = localStorage.getItem('finSaveData');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([
        { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
        { id: 3, date: '2026-06-27', desc: 'Weekly Groceries', amount: -4500, type: 'Expense', category: 'Food' },
      ]);
    }
    setIsMounted(true);
  }, []);

  const stats = useMemo(() => {
    const bal = transactions.reduce((acc, t) => acc + t.amount, 0);
    const inc = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { bal, inc, exp };
  }, [transactions]);

  const filteredData = transactions.filter(t => 
    activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : 
    activePage === 'INCOME' ? t.type === 'Income' : 
    activePage === 'EXPENSES' ? t.type === 'Expense' : true
  );

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTransactions = [{
      id: Date.now(),
      date: formData.date,
      desc: formData.desc,
      category: formData.category,
      type: formData.type,
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    }, ...transactions];
    
    setTransactions(newTransactions);
    localStorage.setItem('finSaveData', JSON.stringify(newTransactions));
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  const inputStyle = `w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-500 transition-colors ${
    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
  }`;

  const getCards = () => {
    if (activePage === 'INCOME') return [{ title: 'TOTAL INCOME', val: stats.inc, color: 'text-emerald-500' }];
    if (activePage === 'EXPENSES') return [{ title: 'TOTAL EXPENSES', val: stats.exp, color: 'text-red-500' }];
    return [
        { title: 'Current Balance', val: stats.bal, color: isDarkMode ? 'text-white' : 'text-slate-900' },
        { title: 'TOTAL INCOME', val: stats.inc, color: 'text-emerald-500' },
        { title: 'TOTAL EXPENSES', val: stats.exp, color: 'text-red-500' }
    ];
  };

  const cards = getCards();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside className={`border-r transition-all duration-300 flex flex-col py-6 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center gap-3 mb-10 px-6 ${!isSidebarOpen && 'justify-center px-0'}`}>
            <Wallet className="text-cyan-500 shrink-0" size={28} />
            {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight">FinSave</h1>}
        </div>
        <nav className="flex-1 space-y-2 px-3">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
                <button key={item.name} onClick={() => setActivePage(item.name)} 
                    className={`w-full flex items-center p-3 rounded-xl transition ${activePage === item.name ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'} ${!isSidebarOpen && 'justify-center'}`}>
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
                </button>
            ))}
        </nav>
        <div className="px-3 space-y-4">
            <button onClick={() => { localStorage.removeItem('finSaveData'); window.location.reload(); }} className="w-full flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition">
                <Trash2 size={20} />
                {isSidebarOpen && <span className="ml-4 font-medium text-sm">Clear All Data</span>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center"><Menu size={20}/></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">FinSave - {activePage}</h2>

        <div className={`grid grid-cols-1 ${cards.length > 1 ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6 mb-8`}>
            {cards.map((s, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <p className="text-sm font-semibold opacity-70 tracking-wide">{s.title}</p>
                    <h3 className={`text-4xl font-extrabold mt-2 tracking-tight ${s.color}`}>₹{Math.abs(s.val).toLocaleString('en-IN')}</h3>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {activePage === 'DASHBOARD' && (
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold mb-6">Activity Overview</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={transactions.slice().reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: '#334155', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px' }} 
                                    formatter={(value: any) => [`₹${Math.abs(Number(value)).toLocaleString('en-IN')}`, 'Amount']}
                                />
                                <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
                
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold mb-4">Transaction Records</h3>
                    <div className="space-y-3">
                        {filteredData.map(t => (
                            <div key={t.id} className={`flex justify-between items-center py-3 border-b ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
                                <div><p className="font-bold">{t.desc}</p><p className="text-xs opacity-50">{t.date} • {t.category}</p></div>
                                <span className={`font-bold text-lg ${t.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`p-6 rounded-2xl border h-fit ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                <h3 className="font-bold mb-6 flex items-center gap-2"><PlusCircle className="text-cyan-500"/> New Entry</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Description" className={inputStyle} onChange={e => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                    <input type="number" placeholder="Amount (₹)" className={inputStyle} onChange={e => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                    <select className={inputStyle} value={formData.type} onChange={e => {
                        const newType = e.target.value as 'Income' | 'Expense';
                        setFormData({...formData, type: newType, category: CATEGORIES[newType][0]});
                    }}>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <select className={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {CATEGORIES[formData.type].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={addTransaction} className="w-full bg-cyan-500 text-white p-3 rounded-xl font-bold hover:bg-cyan-600 transition shadow-md">Save Transaction</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}