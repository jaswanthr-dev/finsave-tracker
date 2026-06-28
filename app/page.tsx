'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, Menu, Sun, Moon, Trash2 } from 'lucide-react';

interface Transaction { id: number; date: string; desc: string; amount: number; type: 'Income' | 'Expense'; category: string; }

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('finSaveData');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([
        { id: 1, date: '2026-06-25', desc: 'Tech Corp Salary', amount: 85000, type: 'Income', category: 'Salary' },
        { id: 2, date: '2026-06-26', desc: 'Weekly Supermarket', amount: -4800, type: 'Expense', category: 'Food' },
      ]);
    }
    setIsMounted(true);
  }, []);

  const confirmDelete = () => {
    localStorage.removeItem('finSaveData');
    setShowConfirmModal(false);
    setShowBanner(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  if (!isMounted) return null;

  const stats = {
    bal: transactions.reduce((acc, t) => acc + t.amount, 0),
    inc: transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
    exp: transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0)
  };

  const filtered = transactions.filter(t => 
    activePage === 'DASHBOARD' || activePage === 'HISTORY' ? true : 
    activePage === 'INCOME' ? t.type === 'Income' : t.type === 'Expense'
  );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {showBanner && <div className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white p-4 text-center font-bold">Data cleared! Restoring default records...</div>}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`p-8 rounded-3xl w-full max-w-sm ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Delete All Data?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 p-3 rounded-xl font-bold hover:bg-slate-500/10">No</button>
              <button onClick={confirmDelete} className="flex-1 p-3 bg-red-500 text-white rounded-xl font-bold">Yes</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`border-r h-screen sticky top-0 py-6 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center px-6 h-12 mb-12 overflow-hidden">
          <Wallet className="text-cyan-500 flex-shrink-0" size={28} />
          {isSidebarOpen && <h1 className="font-bold text-xl ml-3 whitespace-nowrap">FinSave</h1>}
        </div>
        <nav className="flex flex-col gap-y-4 px-3">
          {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'INCOME', icon: TrendingUp}, {name: 'EXPENSES', icon: TrendingDown}, {name: 'HISTORY', icon: History} ].map((item) => (
            <button key={item.name} onClick={() => setActivePage(item.name)} className="flex items-center p-2 hover:bg-slate-500/10 rounded-xl transition">
              <div className="w-10 flex justify-center flex-shrink-0"><item.icon size={20} className={activePage === item.name ? 'text-cyan-500' : ''} /></div>
              {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-y-4 px-3 pt-6 border-t border-slate-500/10">
          <button onClick={() => setShowConfirmModal(true)} className="flex items-center p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition">
            <div className="w-10 flex justify-center flex-shrink-0"><Trash2 size={20} /></div>
            {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">Clear All Data</span>}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center p-2 hover:bg-slate-500/10 rounded-xl transition"><div className="w-10 flex justify-center"><Menu size={20}/></div></button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center p-2 hover:bg-slate-500/10 rounded-xl transition"><div className="w-10 flex justify-center">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</div></button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-cyan-500">{activePage}</h2>
        
        {activePage === 'DASHBOARD' && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}><p>Balance</p><h3 className="text-3xl font-bold">₹{stats.bal.toLocaleString()}</h3></div>
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}><p>Income</p><h3 className="text-3xl font-bold text-emerald-500">₹{stats.inc.toLocaleString()}</h3></div>
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}><p>Expenses</p><h3 className="text-3xl font-bold text-red-500">₹{stats.exp.toLocaleString()}</h3></div>
          </div>
        )}

        {activePage === 'DASHBOARD' && (
          <div className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold mb-4">Activity Overview</h3>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={transactions}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#06b6d4" /></BarChart></ResponsiveContainer></div>
          </div>
        )}

        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold mb-4">Transaction Details</h3>
          {filtered.map(t => (
            <div key={t.id} className="flex justify-between py-3 border-b border-slate-500/10">
              <div><p className="font-bold">{t.desc}</p><p className="text-xs opacity-50">{t.date}</p></div>
              <span className={`font-bold ${t.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>₹{t.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}