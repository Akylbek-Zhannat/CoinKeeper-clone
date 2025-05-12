import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register      from './pages/Register';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Settings      from './pages/Settings';
import Stats         from './pages/Stats';
import Logout        from './pages/Logout';

import PrivateRoute  from './components/PrivateRoute';
import Layout        from './components/Layout';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />

       
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings"  element={<Settings />} />
          <Route path="stats"     element={<Stats />} />
          <Route path="logout"    element={<Logout />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
