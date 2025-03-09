import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  walletAddress: string | null;
  role: "freelancer" | "client" | null;
}

const initialState: AuthState = {
  walletAddress: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
    },
    setRole: (state, action: PayloadAction<"freelancer" | "client">) => {
      state.role = action.payload;
    },
  },
});

export const { setWalletAddress, setRole } = authSlice.actions;
export default authSlice.reducer;