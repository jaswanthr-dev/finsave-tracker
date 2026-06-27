'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle } from 'lucide-react';

export default function FinSaveDashboard() {
  // 1. Initialize state
  const [transactions, setTransactions] = useState<{id: number, desc: string, amount: number, type: string, date: string}[]>([]);
  const [formData, setFormData] = useState({ desc: '', amount: '', type: 'Income' });
  const [isMounted, setIsMounted] = useState(false);

  // 2. Load data only after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('finsave-data');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([{ id: 1, desc: 'Initial Salary', amount: 45000, type: 'Income', date: '2026-06-01' }]);
    }
  }, []);

  // 3. Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('finsave-data', JSON.stringify(transactions));
    }
  }, [transactions, isMounted]);

  const addTransaction = () => {
    if (!formData.desc || !formData.amount) return;
    const newTx = { 
      id: Date.now(), 
      ...formData, 
      amount: formData.type === 'Expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [...prev, newTx]);
    setFormData({ desc: '', amount: '', type: 'Income' });
  };

  const total = transactions.reduce((acc, t) => acc + t.amount, 0);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">FinSave Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl mb-4">Total Balance: ₹{total.toLocaleString()}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl mb-4 flex items-center gap-2"><PlusCircle /> New Entry</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white" onChange={(e) => setFormData({...formData, desc: e.target.value})} value={formData.desc} />
            <input type="number" placeholder="Amount" className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white" onChange={(e) => setFormData({...formData, amount: e.target.value})} value={formData.amount} />
            <select className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white" onChange={(e) => setFormData({...formData, type: e.target.value})} value={formData.type}>
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