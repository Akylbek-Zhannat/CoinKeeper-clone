import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTransaction } from '../features/transactions/transactionsSlice';
import styles from './EditTransactionForm.module.css';

export default function EditTransactionForm({ data, onCancel, onDone }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.transactions);

  const [type, setType]       = useState(data.type);
  const [amount, setAmount]   = useState(data.amount);
  const [category, setCategory] = useState(data.category);
  const [date, setDate]       = useState(data.date.slice(0,10));
  const [comment, setComment] = useState(data.comment || '');

  const handleSave = e => {
    e.preventDefault();
    dispatch(updateTransaction({ id: data.id, type, amount: Number(amount), category, date, comment }))
      .unwrap()
      .then(onDone);
  };

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <div className={styles.row}>
        <label>Тип
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </label>
      </div>
      <div className={styles.row}>
        <label>Сумма
          <input
            type="number" value={amount}
            onChange={e => setAmount(e.target.value)} required
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>Категория
          <input
            type="text" value={category}
            onChange={e => setCategory(e.target.value)} required
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>Дата
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)} required
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>Комментарий
          <input
            type="text" value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.buttons}>
        <button type="submit" disabled={loading}>
          {loading ? 'Сохраняем…' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
