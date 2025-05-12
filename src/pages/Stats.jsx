import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import styles from './Stats.module.css';

const COLORS = [
  '#0088FE','#00C49F','#FFBB28','#FF8042','#A28AFF','#FF6699','#33CC33','#FF3333'
];

export default function Stats() {
  const transactions = useSelector(state => state.transactions.list);

  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));

  const filtered = useMemo(
    () => transactions.filter(tx => {
      const dateStr = tx.date.slice(0, 10);
      return dateStr >= start && dateStr <= end;
    }),
    [transactions, start, end]
  );

  const incomeData = useMemo(() => {
    const map = {};
    filtered.forEach(tx => {
      if (tx.type === 'income') {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const expenseData = useMemo(() => {
    const map = {};
    filtered.forEach(tx => {
      if (tx.type === 'expense') {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  return (
    <div className={styles.container}>
      <h1>Статистика</h1>
      <div className={styles.filters}>
        <label>
          С начала:
          <input
            type="date"
            value={start}
            onChange={e => setStart(e.target.value)}
          />
        </label>
        <label>
          По:
          <input
            type="date"
            value={end}
            onChange={e => setEnd(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h2>Доходы по категориям</h2>
          <BarChart width={400} height={300} data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {incomeData.map((entry, idx) => (
                <Cell
                  key={`cell-income-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
        <div className={styles.chartBox}>
          <h2>Расходы по категориям</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {expenseData.map((entry, idx) => (
                <Cell
                  key={`cell-expense-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
