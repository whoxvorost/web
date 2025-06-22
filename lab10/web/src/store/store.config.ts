// store.ts
import {configureStore} from '@reduxjs/toolkit';
import doctorsReducer from './doctors.slice';
import cartsReducer from './carts.slice';

const store = configureStore({
    reducer: {
        doctorsReducer,
        cartsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;