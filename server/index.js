const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'SECRET_KEY';


const transactionsByUser = {};  
const categoriesByUser   = {};  

// Middleware для проверки JWT и получения req.user.email
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

const users = [];


// Регистрация
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash });
  transactionsByUser[email] = [];
  categoriesByUser[email]   = [];
  const token = jwt.sign({ email }, SECRET);
  res.json({ user: { email }, token });
});

// Логин
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Неверные данные' });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ message: 'Неверные данные' });
  }
  const token = jwt.sign({ email }, SECRET);
  res.json({ user: { email }, token });
});



// Получить список категорий текущего пользователя
app.get('/api/categories', authMiddleware, (req, res) => {
  const list = categoriesByUser[req.user.email] || [];
  res.json({ categories: list });
});

// Создать категорию
app.post('/api/categories', authMiddleware, (req, res) => {
  const list = categoriesByUser[req.user.email] ||= [];
  const { name, icon, color } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Название категории обязательно' });
  }
  const id = list.length + 1;
  const cat = {
    id,
    name,
    icon: icon || '📁',
    color: color || '#2196f3'
  };
  list.push(cat);
  res.status(201).json(cat);
});

// Удалить категорию
app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const list = categoriesByUser[req.user.email] || [];
  const id = Number(req.params.id);
  const idx = list.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Категория не найдена' });
  }
  list.splice(idx, 1);
  res.sendStatus(204);
});



// Получить последние транзакции
app.get('/api/transactions', authMiddleware, (req, res) => {
  const arr = transactionsByUser[req.user.email] || [];
  res.json({ transactions: arr.slice(-10).reverse() });
});

// Получить баланс
app.get('/api/transactions/balance', authMiddleware, (req, res) => {
  const arr = transactionsByUser[req.user.email] || [];
  const balance = arr.reduce(
    (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
    0
  );
  res.json({ balance });
});

// Создать транзакцию
app.post('/api/transactions', authMiddleware, (req, res) => {
  const arr = transactionsByUser[req.user.email] ||= [];
  const { type, amount, category, date, comment } = req.body;
  if (!type || typeof amount !== 'number' || !category || !date) {
    return res.status(400).json({ message: 'Некорректные данные транзакции' });
  }
  const id = arr.length + 1;
  const tx = { id, type, amount, category, date, comment };
  arr.push(tx);
  res.status(201).json(tx);
});

// Обновить транзакцию
app.put('/api/transactions/:id', authMiddleware, (req, res) => {
  const arr = transactionsByUser[req.user.email] || [];
  const id = Number(req.params.id);
  const idx = arr.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Транзакция не найдена' });
  }
  const { type, amount, category, date, comment } = req.body;
  const updated = { id, type, amount, category, date, comment };
  arr[idx] = updated;
  res.json(updated);
});

// Удалить транзакцию
app.delete('/api/transactions/:id', authMiddleware, (req, res) => {
  const arr = transactionsByUser[req.user.email] || [];
  const id = Number(req.params.id);
  const idx = arr.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Транзакция не найдена' });
  }
  arr.splice(idx, 1);
  res.sendStatus(204);
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API запущено на http://localhost:${PORT}`);
});
