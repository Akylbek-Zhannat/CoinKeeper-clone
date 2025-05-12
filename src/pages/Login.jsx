import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../features/auth/authSlice';
import { loadCategories } from '../features/categories/categoriesSlice';
import { loadTransactions, loadBalance } from '../features/transactions/transactionsSlice';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(loadCategories());
      dispatch(loadTransactions());
      dispatch(loadBalance());
      navigate('/dashboard');
    }
  }, [token, dispatch, navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

  return (
    <div className={styles.container}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <p className={styles.registerText}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
