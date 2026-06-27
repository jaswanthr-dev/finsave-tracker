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

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '2026-06-01', desc: 'Tech Corp Salary', amount: 45000, type: 'Income', category: 'Salary' },
  { id: 2, date: '2026-06-05', desc: 'Groceries', amount: -2000, type: 'Expense', category: 'Food' },
  { id: 3, date: '2026-06-10', desc: 'Transport', amount: -1500, type: 'Expense', category: 'Transport' },
  { id: 4, date: '2026-06-15', desc: 'Utilities', amount: -2400, type: 'Expense', category: 'Utilities' }
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [formData, setFormData] = useState({ date: '2026-06-27', desc: '', amount: '', type: 'Income', category: 'Salary' });

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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Sidebar Area - Updated for perfect icon scaling and centering */}
      <aside className={`border-r border-slate-800/60 py-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64 px-5' : 'w-20 px-3'} bg-slate-950 relative z-20`}>
        
        {/* Logo Section */}
        <div className={`flex items-center gap-3 mb-10 overflow-hidden h-10 mt-2 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
          <Wallet size={28} className="shrink-0 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
          {isSidebarOpen && <h1 className="text-2xl font-bold text-slate-100 tracking-wide whitespace-nowrap">FinSave</h1>}
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-2">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map(item => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center py-3 rounded-xl transition ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} ${activePage === item.name ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/50'}`}>
              <item.icon size={20} className="shrink-0" /> 
              {isSidebarOpen && <span className="ml-4 font-medium text-sm whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-2 pt-6">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-full flex items-center py-3 text-slate-400 hover:text-slate-200 transition rounded-xl hover:bg-slate-800/50 ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
            <Menu size={20} className="shrink-0" /> 
            {isSidebarOpen && <span className="ml-4 text-sm whitespace-nowrap">Collapse</span>}
          </button>
          <button className={`w-full flex items-center py-3 text-slate-400 hover:text-slate-200 transition rounded-xl hover:bg-slate-800/50 ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
            <Sun size={20} className="shrink-0"/> 
            {isSidebarOpen && <span className="ml-4 text-sm whitespace-nowrap">Light Mode</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-8 tracking-tight">FinSave - {activePage}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {activePage === 'DASHBOARD' && (
            <>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm"><p className="text-slate-400 text-sm mb-1 font-medium">Total Balance</p><h3 className="text-3xl font-bold text-white">₹{stats.balance.toLocaleString('en-IN')}</h3></div>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm"><p className="text-slate-400 text-sm mb-1 font-medium">Total Income</p><h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString('en-IN')}</h3></div>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm"><p className="text-slate-400 text-sm mb-1 font-medium">Total Expenses</p><h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString('en-IN')}</h3></div>
            </>
          )}
          {activePage === 'INCOME' && (
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-green-500/20 shadow-sm col-span-3"><p className="text-green-500/80 text-sm mb-1 font-medium">Total Income Tracked</p><h3 className="text-4xl font-bold text-green-500">₹{stats.income.toLocaleString('en-IN')}</h3></div>
          )}
          {activePage === 'EXPENSES' && (
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-red-500/20 shadow-sm col-span-3"><p className="text-red-500/80 text-sm mb-1 font-medium">Total Expenses Tracked</p><h3 className="text-4xl font-bold text-red-500">₹{stats.expense.toLocaleString('en-IN')}</h3></div>
          )}
          {activePage === 'HISTORY' && (
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm col-span-3"><p className="text-slate-400 text-sm mb-1 font-medium">Transaction History</p><h3 className="text-4xl font-bold text-white">{transactions.length} Records</h3></div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={filtered} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 || val <= -1000 ? `${val/1000}k` : val} />
                <Tooltip 
                  cursor={{fill: '#1e293b', opacity: 0.4}} 
                  contentStyle={{backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc'}}
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[2, 2, 2, 2]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-8 space-y-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Records Breakdown</h3>
               {filtered.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-800 bg-[#0b1120] hover:border-slate-700 transition">
                     <div>
                        <p className="font-semibold text-slate-200">{t.desc}</p>
                        <p className="text-xs text-slate-500 mt-1">{t.date} • {t.category}</p>
                     </div>
                     <p className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                     </p>
                  </div>
               ))}
               {filtered.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No records found for this section.</p>}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800/80 shadow-sm h-fit sticky top-8">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-white"><PlusCircle size={20} className="text-blue-500"/> New Entry</h3>
            
            <div className="space-y-4">
                <input type="date" className="w-full p-3 bg-transparent border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 text-sm transition" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date}/>
                
                <input type="text" placeholder="Description" className="w-full p-3 bg-transparent border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 text-sm transition placeholder:text-slate-500" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc}/>
                
                <input type="number" placeholder="Amount (₹)" className="w-full p-3 bg-transparent border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 text-sm transition placeholder:text-slate-500" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
                
                <select className="w-full p-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-blue-500 outline-none text-slate-200 text-sm transition appearance-none" onChange={(e) => setFormData({...formData, type: e.target.value, category: e.target.value === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]})}>
                <option value="Income">Income</option><option value="Expense">Expense</option>
                </select>
                
                <select className="w-full p-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:border-blue-500 outline-none text-slate-200 text-sm transition appearance-none mb-2" onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
                {(formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                
                <button onClick={addTransaction} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-500/25 mt-2">Save Transaction</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}