import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories,
  postCategory,
  deleteCategoryApi
} from '../../api/categories';
import { logout } from '../auth/authSlice';

// Загрузка списка категорий
export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchCategories();
      return data.categories;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Создание новой категории
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (cat, { rejectWithValue }) => {
    try {
      const { data } = await postCategory(cat);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Удаление категории
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Сброс при logout
    builder.addCase(logout, () => initialState);

    // loadCategories
    builder
      .addCase(loadCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createCategory
    builder
      .addCase(createCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteCategory
    builder
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
