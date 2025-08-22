import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      // Simple authentication check
      if (email === "pavan@gmail.com" && password === "Pavan@16") {
        state.isAuthenticated = true;
        state.user = {
          email,
          name: "Pavan",
        };
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
