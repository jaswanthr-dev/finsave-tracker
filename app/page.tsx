'use client';
import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Menu, Sun, Moon } from 'lucide-react';

export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState('DASHBOARD');

  useEffect(() => { setIsMounted(true); }, []);

  const data = [
    { date: '01/06', amount: 45000 },
    { date: '05/06', amount: 2000 },
    { date: '10/06', amount: 1500 },
    { date: '15/06', amount: 2400 },
  ];

  if (!isMounted) return null;

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-center mb-10 h-10">
            <Wallet size={28} className="text-blue-900" />
            {isSidebarOpen && <span className="ml-3 font-bold text-xl">FinSave</span>}
          </div>
          
          <nav className="flex-1 px-3 space-y-2">
            {[ {name: 'DASHBOARD', icon: LayoutDashboard}, {name: 'HISTORY', icon: History} ].map(item => (
              <button key={item.name} onClick={() => setActivePage(item.name)} 
                className={`w-full flex items-center p-3 rounded-xl transition ${isSidebarOpen ? 'justify-start' : 'justify-center'} ${activePage === item.name ? 'bg-blue-900 text-white' : ''}`}>
                <item.icon size={20} />
                {isSidebarOpen && <span className="ml-4 text-sm font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="px-3 space-y-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-800/10">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-800/10">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 drop-shadow-[0_0_8px_rgba(30,58,138,0.3)]">
          FinSave Dashboard
        </h2>

        {/* Graph */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-blue-900 font-bold mb-6 drop-shadow-[0_0_5px_rgba(30,58,138,0.5)]">
            Amount vs Date
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="date" stroke="#1e3a8a" tick={{fill: '#1e3a8a'}} />
              <YAxis stroke="#1e3a8a" tick={{fill: '#1e3a8a'}} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#020617' : '#fff' }} />
              <Bar dataKey="amount" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}