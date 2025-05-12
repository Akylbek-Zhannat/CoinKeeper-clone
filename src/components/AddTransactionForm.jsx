import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AddTransactionForm.module.css';
import { createTransaction } from '../features/transactions/transactionsSlice';
import { loadCategories }  from '../features/categories/categoriesSlice';

export default function AddTransactionForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.transactions);
  const categories = useSelector(state => state.categories.list);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createTransaction({ type, amount: Number(amount), category, date, comment }))
      .unwrap()
      .then(onClose);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <label>
          Тип
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Сумма
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Категория
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>– выберите категорию –</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Дата
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Комментарий
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.buttons}>
        <button type="submit" disabled={loading}>
          {loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onClose}>
          Отмена
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>)
}
