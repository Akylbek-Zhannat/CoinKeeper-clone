import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Главная
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Категории
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Статистика
      </NavLink>
      <NavLink
        to="/logout"
        className={styles.link}
      >
        Выйти
      </NavLink>
    </nav>
  );
}
