import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Balance.module.css';

export default function Balance() {
  const balance = useSelector(s => s.transactions.balance);
  return (
    <div className={styles.balance}>
      <h2>Баланс</h2>
      <p>{balance.toLocaleString('ru-RU', { style: 'currency', currency: 'KZT' })}</p>
    </div>
  );
}
