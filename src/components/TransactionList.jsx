import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../features/transactions/transactionsSlice';
import EditTransactionForm from './EditTransactionForm';
import styles from './TransactionList.module.css';

export default function TransactionList() {
  const list = useSelector(s => s.transactions.list);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);

  if (!list.length) return <p>Транзакций ещё нет.</p>;

  return (
    <ul className={styles.list}>
      {list.map(tx => (
        <li key={tx.id} className={styles.item}>
          {editingId === tx.id ? (
            <EditTransactionForm
              data={tx}
              onCancel={() => setEditingId(null)}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <>
              <span className={styles.type}>
                {tx.type === 'income' ? '+' : '-'}
              </span>
              <span className={styles.amount}>{tx.amount}</span>
              <span className={styles.category}>{tx.category}</span>
              <span className={styles.date}>
                {new Date(tx.date).toLocaleDateString()}
              </span>

              <button
                className={styles.btn}
                onClick={() => dispatch(deleteTransaction(tx.id))}
              >
                🗑
              </button>
              <button
                className={styles.btn}
                onClick={() => setEditingId(tx.id)}
              >
                ✏️
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
