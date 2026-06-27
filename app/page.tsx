'use client';
import { useState, useMemo, useEffect } from 'react';
// ... (keep your imports as they are)

// 1. Initialize empty state to prevent hardcoded overwrite
export default function FinSaveDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [transactions, setTransactions] = useState([]); // <--- START EMPTY
  const [formData, setFormData] = useState({ date: '', desc: '', amount: '', type: 'Income', category: 'Salary' });
  // ... (keep other state variables)

  // 2. Load: Runs once on mount. 
  // It checks for saved data. If none exists, it uses INITIAL_DATA.
  useEffect(() => {
    const savedData = localStorage.getItem('finsave-data');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    } else {
      setTransactions([
        { id: 1, date: '2026-06-01', desc: 'Monthly Salary', amount: 45000, type: 'Income', category: 'Salary' },
        { id: 2, date: '2026-06-05', desc: 'Grocery Shopping', amount: -3200, type: 'Expense', category: 'Food' },
        { id: 3, date: '2026-06-10', desc: 'Electricity Bill', amount: -1500, type: 'Expense', category: 'Housing' },
        { id: 4, date: '2026-06-15', desc: 'Fuel', amount: -1200, type: 'Expense', category: 'Transport' },
      ]);
    }
    setIsMounted(true);
    setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  // 3. Save: Runs every time 'transactions' changes.
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('finsave-data', JSON.stringify(transactions));
    }
  }, [transactions, isMounted]);

  // ... (keep the rest of your components and logic)