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

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '06-01', desc: 'Salary', amount: 45000, type: 'Income', category: 'Salary' },
  { id: 2, date: '06-05', desc: 'Groceries', amount: -2000, type: 'Expense', category: 'Food' },
  { id: 3, date: '06-10', desc: 'Rent', amount: -15000, type: 'Expense', category: 'Housing' },
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
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
      type: formData.type,
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };
    setTransactions((prev) => [...prev, newTx]);
    setFormData({ date: '2026-06-27', desc: '', amount: '', type: 'Income', category: 'Salary' });
  };

  const filtered = transactions.filter((t) => activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : (activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense'));

  const getPageTitle = () => activePage === 'DASHBOARD' ? 'FinSave - DASHBOARD' : 'FinSave - Record List';

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`border-r transition-all duration-300 flex flex-col py-6 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center mb-10 h-10 ${isSidebarOpen ? 'px-6 gap-3' : 'justify-center'}`}>
          <Wallet size={28} className="shrink-0 text-blue-900" />
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">FinSave</h1>}
        </div>
        
        <nav className="flex-1 space-y-2 px-3">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} 
              className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start' : 'justify-center'} ${activePage === item.name ? 'bg-blue-900 text-white' : 'hover:bg-slate-500/10'}`}>
              <item.icon size={20} className="shrink-0" /> 
              {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="px-3 space-y-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 rounded-xl hover:bg-slate-500/10 transition justify-center">
                <Menu size={20} />
                {isSidebarOpen && <span className="ml-4 text-sm font-medium">Collapse</span>}
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center p-3 rounded-xl hover:bg-slate-500/10 transition justify-center">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                {isSidebarOpen && <span className="ml-4 text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 drop-shadow-[0_0_8px_rgba(30,58,138,0.3)]">{getPageTitle()}</h2>
        
        {activePage === 'DASHBOARD' ? (
          /* Dashboard View: Graph + New Entry */
          <div className="space-y-8">
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-blue-900 font-bold mb-6">Amount and Date Graph</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filtered}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                    <XAxis dataKey="date" stroke="#1e3a8a" tick={{fill: '#1e3a8a'}} />
                    <YAxis stroke="#1e3a8a" tick={{fill: '#1e3a8a'}} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#020617' : '#fff' }} />
                    <Bar dataKey="amount" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 max-w-md shadow-xl">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-white"><PlusCircle size={20} className="text-blue-900"/> New Entry</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                    <input type="number" placeholder="Amount (₹)" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                    <select className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option className="bg-slate-950" value="Income">Income</option>
                        <option className="bg-slate-950" value="Expense">Expense</option>
                    </select>
                    <button onClick={addTransaction} className="w-full bg-blue-900 text-white p-3 rounded-xl font-bold hover:bg-blue-800 transition">Save Transaction</button>
                </div>
            </div>
          </div>
        ) : (
          /* Record List View */
          <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left">
              <thead>
                <tr className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-100'}>
                  <th className="p-4 font-semibold text-slate-500">Date</th>
                  <th className="p-4 font-semibold text-slate-500">Description</th>
                  <th className="p-4 font-semibold text-slate-500">Category</th>
                  <th className="p-4 font-semibold text-slate-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="p-4">{t.date}</td>
                    <td className="p-4">{t.desc}</td>
                    <td className="p-4 text-sm text-slate-400">{t.category}</td>
                    <td className={`p-4 font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-IN')}
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