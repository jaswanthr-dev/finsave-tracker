'use client';
import { useState, useEffect } from 'react';
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
    if (saved) setTransactions(JSON.parse(saved));
    else setTransactions([
      { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
      { id: 2, date: '2026-06-25', desc: 'Freelance UI Design', amount: 15000, type: 'Income', category: 'Freelance' },
      { id: 3, date: '2026-06-26', desc: 'Weekly Supermarket', amount: -4800, type: 'Expense', category: 'Food' },
    ]);
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
    setIsMounted(true);
  }, []);

  const confirmDelete = () => { localStorage.removeItem('finSaveData'); window.location.reload(); };
  const toggleTheme = () => { const newTheme = !isDarkMode; setIsDarkMode(newTheme); localStorage.setItem('isDarkMode', JSON.stringify(newTheme)); };
  
  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTransactions = [{ id: Date.now(), ...formData, amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) }, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('finSaveData', JSON.stringify(newTransactions));
    setFormData({...formData, desc: '', amount: ''});
  };

  if (!isMounted) return null;

  const stats = { bal: transactions.reduce((acc, t) => acc + t.amount, 0), inc: transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0), exp: transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0) };
  const inputStyle = `w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-500 transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`;
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`p-8 rounded-3xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Delete All Data?</h3>
            <p className="opacity-70 mb-8 text-sm">This will permanently remove all transactions. Default records will be restored on refresh.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 p-3 rounded-xl font-bold hover:bg-slate-500/10">No, Cancel</button>
              <button onClick={confirmDelete} className="flex-1 p-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`border-r h-screen sticky top-0 py-6 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center px-6 h-12 mb-10 overflow-hidden">
          <Wallet className="text-cyan-500 flex-shrink-0" size={28} />
          {isSidebarOpen && <h1 className="font-bold text-xl ml-3 whitespace-nowrap">FinSave</h1>}
        </div>

        <nav className="flex flex-col gap-y-2 px-3">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className="flex items-center p-3 rounded-xl transition hover:bg-slate-500/10">
              <div className="w-10 flex justify-center flex-shrink-0"><item.icon size={20} className={activePage === item.name ? 'text-cyan-500' : ''} /></div>
              {isSidebarOpen && <span className="ml-2 font-medium text-sm whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 flex flex-col gap-y-3">
          <button onClick={() => setShowConfirmModal(true)} className="flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition">
            <div className="w-10 flex justify-center flex-shrink-0"><Trash2 size={20} /></div>
            {isSidebarOpen && <span className="ml-2 font-medium text-sm whitespace-nowrap">Clear All Data</span>}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center">
            <div className="w-10 flex justify-center"><Menu size={20}/></div>
          </button>
          <button onClick={toggleTheme} className="flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center">
            <div className="w-10 flex justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</div>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">Dashboard</h2>
        {/* Dashboard Content remains the same */}
      </main>
    </div>
  );
}