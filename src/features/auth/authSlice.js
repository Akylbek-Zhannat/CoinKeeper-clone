import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../../api/auth';

const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  user: null,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
};

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);
      return response.data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerAsync.pending, state => { state.loading = true; })
      .addCase(registerAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
      })
      .addCase(registerAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loginAsync.pending, state => { state.loading = true; })
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
      })
      .addCase(loginAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
