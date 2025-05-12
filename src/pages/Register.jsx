import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync } from '../features/auth/authSlice';
import styles from './Register.module.css';

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(registerAsync({ email, password }));
  };

  return (
    <div className={styles.container}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
