import { configureStore } from '@reduxjs/toolkit';
import { endpointCallApi } from 'src/entities/EndpointCall';

export const store = configureStore({
  reducer: {
    [endpointCallApi.reducerPath]: endpointCallApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(endpointCallApi.middleware),
});

declare global {
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
}
