import { configureStore } from "@reduxjs/toolkit";

import themeSlice from "./features/theme/themeSlice";
import authSlice from "./features/auth/authSlice";
import jobSlice from "./features/transfer/jobSlice";
import { authApi } from "./features/auth/authApi";
import { transferApi } from "./features/transfer/transferApi";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    job: jobSlice,
    [authApi.reducerPath]: authApi.reducer,
    [transferApi.reducerPath]: transferApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, transferApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
