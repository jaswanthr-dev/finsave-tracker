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
  { id: 4, date: '06-15', desc: 'Freelance', amount: 8000, type: 'Income', category: 'Freelance' },
  { id: 5, date: '06-20', desc: 'Dining', amount: -1200, type: 'Expense', category: 'Food' }
];

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);

  useEffect(() => { setIsMounted(true); }, []);

  const stats = useMemo(() => {
    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { balance, income, expense };
  }, [transactions]);

  const filtered = transactions.filter((t) => 
    activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : 
    (activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense')
  );

  const totalFiltered = filtered.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`border-r transition-all duration-300 flex flex-col py-6 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center gap-3 mb-10 overflow-hidden ${isSidebarOpen ? 'px-6' : 'justify-center'}`}>
          <Wallet size={28} className="shrink-0 text-blue-600" />
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">FinSave</h1>}
        </div>
        
        <nav className="flex-1 space-y-2 px-3">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} 
              className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start' : 'justify-center'} ${activePage === item.name ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/10'}`}>
              <item.icon size={20} className="shrink-0" /> 
              {isSidebarOpen && <span className="ml-4 font-medium text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Controls */}
        <div className="px-3 space-y-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center p-3 rounded-xl hover:bg-slate-200/10 transition justify-center">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                {isSidebarOpen && <span className="ml-4 text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 rounded-xl hover:bg-slate-200/10 transition justify-center">
                <Menu size={20} />
                {isSidebarOpen && <span className="ml-4 text-sm font-medium">Collapse</span>}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-8">{activePage}</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-slate-500 text-sm">Balance</p>
                <h3 className="text-2xl font-bold">₹{stats.balance.toLocaleString('en-IN')}</h3>
            </div>
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-slate-500 text-sm">Total Income</p>
                <h3 className="text-2xl font-bold text-green-500">₹{stats.income.toLocaleString('en-IN')}</h3>
            </div>
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-slate-500 text-sm">Total Expenses</p>
                <h3 className="text-2xl font-bold text-red-500">₹{stats.expense.toLocaleString('en-IN')}</h3>
            </div>
        </div>

        {/* Graph Section */}
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-end mb-6">
                <h3 className="font-bold text-lg">Activity Overview</h3>
                <div className="text-right">
                    <p className="text-xs text-slate-500">Total {activePage.toLowerCase()}</p>
                    <p className="text-2xl font-bold text-blue-600">₹{totalFiltered.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#64748b' : '#94a3b8'} />
                <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: '#3b82f6' }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </main>
    </div>
  );
}