import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBalance,
  fetchTransactions,
  postTransaction,
  updateTransactionApi,
  deleteTransactionApi
} from '../../api/transactions';
import { logout } from '../auth/authSlice';

// Загрузка баланса
export const loadBalance = createAsyncThunk(
  'transactions/loadBalance',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchBalance();
      return data.balance;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Загрузка списка транзакций
export const loadTransactions = createAsyncThunk(
  'transactions/loadTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchTransactions();
      return data.transactions;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Создание транзакции
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (tx, { rejectWithValue }) => {
    try {
      const { data } = await postTransaction(tx);
      return data; // новая транзакция
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Обновление транзакции
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const { data } = await updateTransactionApi(id, fields);
      return data; // обновлённая транзакция
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Удаление транзакции
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTransactionApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  balance: 0,
  list: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Сброс стейта при выходе
    builder.addCase(logout, () => initialState);

    // loadBalance
    builder
      .addCase(loadBalance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(loadBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // loadTransactions
    builder
      .addCase(loadTransactions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createTransaction
    builder
      .addCase(createTransaction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        // пересчёт баланса
        state.balance = state.list.reduce(
          (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
          0
        );
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateTransaction
    builder
      .addCase(updateTransaction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(t =>
          t.id === action.payload.id ? action.payload : t
        );
        state.balance = state.list.reduce(
          (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
          0
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteTransaction
    builder
      .addCase(deleteTransaction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(t => t.id !== action.payload);
        state.balance = state.list.reduce(
          (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
          0
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionsSlice.reducer;
