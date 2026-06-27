import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    totalBalance: 85240.50,
    monthlyIncome: 12000.00,
    monthlyExpenses: 4500.25,
    chartData: [
      { name: 'Jan', income: 4000, expense: 2400 },
      { name: 'Feb', income: 3000, expense: 1398 },
      { name: 'Mar', income: 2000, expense: 9800 },
      { name: 'Apr', income: 2780, expense: 3908 },
    ],
    history: [
      { id: 1, desc: 'Internet Bill', amount: -500, date: '2026-06-25' },
      { id: 2, desc: 'Salary', amount: 12000, date: '2026-06-01' },
      { id: 3, desc: 'Groceries', amount: -1200, date: '2026-06-20' },
      { id: 4, desc: 'Bike Service', amount: -2800, date: '2026-06-15' },
    ]
  };
  
  return NextResponse.json(data);
}