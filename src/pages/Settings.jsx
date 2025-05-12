import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCategories,
  createCategory,
  deleteCategory
} from '../features/categories/categoriesSlice';
import styles from './Settings.module.css';

export default function Settings() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(s => s.categories);

  const [name, setName]   = useState('');
  const [icon, setIcon]   = useState('📁');
  const [color, setColor] = useState('#2196f3');

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const handleAdd = e => {
    e.preventDefault();
    dispatch(createCategory({ name, icon, color })).unwrap()
      .then(() => setName(''))
      .catch(console.error);
  };

  return (
    <div className={styles.container}>
      <h1>Настройки категорий</h1>
      {loading && <p>Загрузка…</p>}
      {error && <p className={styles.error}>Ошибка: {error}</p>}


      <form onSubmit={handleAdd} className={styles.form}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Иконка (emoji или название)" 
          value={icon}
          onChange={e => setIcon(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>


      <ul className={styles.list}>
        {list.map(c => (
          <li key={c.id} className={styles.item}>
            <span className={styles.preview} style={{ background: c.color }}>
              {c.icon}
            </span>
            <span className={styles.name}>{c.name}</span>
            <button
              className={styles.deleteBtn}
              onClick={() => dispatch(deleteCategory(c.id))}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
