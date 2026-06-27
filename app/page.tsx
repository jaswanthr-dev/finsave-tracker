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
    setTransactions((prev) => [...prev, newTx]);
    setFormData((prev) => ({ ...prev, desc: '', amount: '' }));
  };

  const filtered = transactions.filter((t: Transaction) => 
    activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : 
    (activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense')
  );

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <aside className={`border-r border-slate-800/60 py-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64 px-5' : 'w-20 px-3'} bg-slate-950`}>
        <div className={`flex items-center gap-3 mb-10 overflow-hidden h-10 mt-2 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
          {/* Changed color to a subtle Dark Blue */}
          <Wallet size={28} className="shrink-0 text-blue-900" />
          {isSidebarOpen && <h1 className="text-2xl font-bold text-slate-100 tracking-wide whitespace-nowrap">FinSave</h1>}
        </div>
        
        <nav className="space-y-2">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className={`w-full flex items-center py-3 rounded-xl transition ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} ${activePage === item.name ? 'bg-blue-900 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <item.icon size={20} className="shrink-0" /> 
              {isSidebarOpen && <span className="ml-4 font-medium text-sm whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Title now uses blue-900 */}
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 tracking-tight">FinSave - {activePage}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {activePage === 'DASHBOARD' && (
            <>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800"><p className="text-slate-400 text-sm">Balance</p><h3 className="text-3xl font-bold text-blue-900">₹{stats.balance.toLocaleString('en-IN')}</h3></div>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800"><p className="text-slate-400 text-sm">Income</p><h3 className="text-3xl font-bold text-green-500">₹{stats.income.toLocaleString('en-IN')}</h3></div>
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800"><p className="text-slate-400 text-sm">Expenses</p><h3 className="text-3xl font-bold text-red-500">₹{stats.expense.toLocaleString('en-IN')}</h3></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(val: any) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }}
                />
                {/* Bar color updated to match the new dark blue theme */}
                <Bar dataKey="amount" fill="#1e3a8a" radius={[2, 2, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}