'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown, History, PlusCircle, Inbox } from 'lucide-react';

export default function FinSaveDashboard() {
  // 1. State initialization
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ date: '', desc: '', amount: '', type: 'Income', category: 'Salary' });
  const [isClient, setIsClient] = useState(false);

  // 2. Load data from localStorage exactly once when component mounts
  useEffect(() => {
    const saved = localStorage.getItem('finsave-data');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([
        { id: 1, date: '2026-06-01', desc: 'Monthly Salary', amount: 45000, type: 'Income', category: 'Salary' }
      ]);
    }
    setIsClient(true);
    setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  // 3. Save to localStorage EVERY time transactions changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('finsave-data', JSON.stringify(transactions));
    }
  }, [transactions, isClient]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTx = { 
      id: Date.now(), 
      ...formData, 
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)) 
    };
    setTransactions(prev => [...prev, newTx]);
    setFormData(prev => ({ ...prev, desc: '', amount: '' }));
  };

  const total = transactions.reduce((acc, t) => acc + t.amount, 0);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">FinSave Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl mb-4">Total Balance: ₹{total.toLocaleString()}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Form Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl mb-4 flex items-center gap-2"><PlusCircle /> New Entry</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
            <input type="number" placeholder="Amount" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
            <select className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <button onClick={addTransaction} className="w-full bg-blue-600 p-3 rounded-lg font-bold">Save Transaction</button>
          </div>
        </div>
      </div>
    </div>
  );
}