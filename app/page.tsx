'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon, Trash2, Undo } from 'lucide-react';

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
  const [toast, setToast] = useState<{ visible: boolean; lastData: Transaction[] | null }>({ visible: false, lastData: null });
  
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
        { id: 10, date: '2026-06-28', desc: 'Gym Membership', amount: -2000, type: 'Expense', category: 'Healthcare' },
        { id: 11, date: '2026-06-28', desc: 'Online Course', amount: -3500, type: 'Expense', category: 'Education' },
      ]);
    }
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
    setIsMounted(true);
  }, []);

  const clearData = () => {
    const dataToSave = [...transactions];
    setToast({ visible: true, lastData: dataToSave });
    setTransactions([]);
    localStorage.removeItem('finSaveData');
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 10000);
  };

  const undoDelete = () => {
    if (toast.lastData) {
      setTransactions(toast.lastData);
      localStorage.setItem('finSaveData', JSON.stringify(toast.lastData));
      setToast({ visible: false, lastData: null });
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside className={`border-r transition-all duration-300 h-screen sticky top-0 flex flex-col flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="h-20 flex items-center gap-3 px-6"><Wallet className="text-cyan-500" size={28} />{isSidebarOpen && <h1 className="font-bold text-xl">FinSave</h1>}</div>
        <nav className="flex-1 overflow-y-auto flex flex-col gap-y-2 px-3">
            {['DASHBOARD', 'INCOME', 'EXPENSES', 'HISTORY'].map((p) => (
                <button key={p} onClick={() => setActivePage(p)} className={`w-full flex items-center p-3 rounded-xl ${activePage === p ? 'bg-cyan-500 text-white' : 'hover:bg-slate-500/10'}`}>
                    <LayoutDashboard size={20} />{isSidebarOpen && <span className="ml-4 text-sm font-medium">{p}</span>}
                </button>
            ))}
        </nav>
        <div className="h-48 px-3 pt-6 border-t border-slate-500/20 flex flex-col gap-y-3">
            <button onClick={clearData} className="w-full flex items-center p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20} />{isSidebarOpen && <span className="ml-4 text-sm">Clear Data</span>}</button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center p-3 hover:bg-slate-500/10 rounded-xl justify-center"><Menu size={20}/></button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <Wallet size={64} className="mb-4 text-cyan-500" />
            <h2 className="text-2xl font-bold">No Data Available</h2>
            <p>Your records are empty. Add a new entry to get started!</p>
          </div>
        ) : (
          <div className="text-center mt-20 text-slate-500">Charts & Records active.</div>
        )}

        {toast.visible && (
          <div className="absolute bottom-8 right-8 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
            <p>All data cleared.</p>
            <button onClick={undoDelete} className="flex items-center gap-2 bg-cyan-500 px-4 py-2 rounded-lg font-bold"><Undo size={16}/> Undo</button>
          </div>
        )}
      </main>
    </div>
  );
}