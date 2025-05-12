import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBalance, loadTransactions } from '../features/transactions/transactionsSlice';
import Balance from '../components/Balance';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.transactions);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(loadBalance());
    dispatch(loadTransactions());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1>Мой кошелёк</h1>
      {loading && <p>Загрузка данных...</p>}
      {error && <p className={styles.error}>Ошибка: {error}</p>}

      <Balance />

      {/* Кнопка открытия формы */}
      <button
        className={styles.addBtn}
        onClick={() => setShowForm(true)}
      >
        Добавить транзакцию
      </button>

      {/* Форма */}
      {showForm && (
        <AddTransactionForm onClose={() => setShowForm(false)} />
      )}

      <TransactionList />
    </div>
  );
}
