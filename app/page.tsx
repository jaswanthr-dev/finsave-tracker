'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  type: string;
  category: string;
}

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({ date: '2026-06-27', desc: '', amount: '', type: 'Income', category: 'Salary' });

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('finSaveData');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem('finSaveData', JSON.stringify(transactions));
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
    setTransactions((prev) => [newTx, ...prev]);
    setFormData({ ...formData, desc: '', amount: '' });
  };

  const deleteTransaction = (id: number) => setTransactions(prev => prev.filter(t => t.id !== id));

  const filtered = transactions.filter((t) => activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : (activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense'));

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`border-r transition-all duration-300 flex flex-col py-6 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center mb-10 h-10 ${isSidebarOpen ? 'px-6 gap-3' : 'justify-center'}`}>
          <Wallet size={28} className="shrink-0 text-blue-600" />
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">FinSave</h1>}
        </div>
        
        <nav className="flex-1 space-y-2 px-2">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} 
              className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} ${activePage === item.name ? 'bg-blue-600 text-white' : 'hover:bg-slate-500/10'}`}>
              <item.icon size={20} className="shrink-0" /> 
              {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="px-2 space-y-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-500/10 transition">
                <Menu size={20} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-500/10 transition">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-8">{activePage === 'DASHBOARD' ? 'FinSave - DASHBOARD' : 'FinSave - Record List'}</h2>
        
        {activePage === 'DASHBOARD' ? (
          <div className="space-y-8">
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold mb-6">Activity Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filtered.slice().reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                    <XAxis dataKey="date" stroke="#3b82f6" tick={{fill: isDarkMode ? '#f8fafc' : '#334155'}} />
                    <YAxis stroke="#3b82f6" tick={{fill: isDarkMode ? '#f8fafc' : '#334155'}} />
                    {/* Tooltip with "Amount" and "Date" labels */}
                    <Tooltip 
                        contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: '#3b82f6', borderRadius: '12px' }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 max-w-md">
                <h3 className="font-bold mb-6 text-white flex items-center gap-2"><PlusCircle size={20}/> New Entry</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                    <input type="number" placeholder="Amount (₹)" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                    <select className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <button onClick={addTransaction} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">Save</button>
                </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
             <table className="w-full text-left">
                <thead>
                    <tr className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-100'}>
                    <th className="p-4">Date</th>
                    <th className="p-4">Desc</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((t) => (
                    <tr key={t.id} className="border-t border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-4">{t.date}</td>
                        <td className="p-4">{t.desc}</td>
                        <td className={`p-4 font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                            <button onClick={() => deleteTransaction(t.id)} className="text-slate-500 hover:text-red-500 transition">
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
          </div>
        )}
      </main>
    </div>
  );
}