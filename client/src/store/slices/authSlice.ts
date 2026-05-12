import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../services/auth.service';
import { AuthUser } from '../../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginHandler = createAsyncThunk<
  { access_token: string; user: AuthUser },
  { email: string; password: string }
>(
  'auth/login',
  (data, { rejectWithValue }) =>
    loginUser(data).catch((err: Error) => rejectWithValue(err.message))
);

export const registerHandler = createAsyncThunk<
  { access_token: string; user: AuthUser },
  { name: string; email: string; password: string; phone?: string; city?: string }
>(
  'auth/register',
  (data, { rejectWithValue }) =>
    registerUser(data).catch((err: Error) => rejectWithValue(err.message))
);

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginHandler.fulfilled,
        (state, action: PayloadAction<{ access_token: string; user: AuthUser }>) => {
          state.loading = false;
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          localStorage.setItem('token', action.payload.access_token);
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(loginHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed.';
      });

    builder
      .addCase(registerHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerHandler.fulfilled,
        (state, action: PayloadAction<{ access_token: string; user: AuthUser }>) => {
          state.loading = false;
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          localStorage.setItem('token', action.payload.access_token);
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(registerHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Registration failed.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
