import { combineSlices, configureStore } from '@reduxjs/toolkit'
import homeSlice, {  } from './features/home/homeSlice';
import socketMiddleware from './middleware/socketMiddleware';
import symbolSlice from './features/symbol/symbolSlice';

const rootReducer = combineSlices(homeSlice, symbolSlice)
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']