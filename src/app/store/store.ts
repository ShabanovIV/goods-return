import { configureStore } from '@reduxjs/toolkit';
import { claimApi } from 'src/entities/Claim';
import { documentApi } from 'src/entities/Document';

export const store = configureStore({
  reducer: {
    [claimApi.reducerPath]: claimApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(claimApi.middleware, documentApi.middleware),
});

declare global {
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
}
