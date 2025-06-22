import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';import {defaultSearchOptions, ICart, ISearchOptions} from "../interfaces/commonInterfaces";
import CartServices from "../services/CartServices";

export const getCarts = createAsyncThunk(
    'carts/getCarts',
    async (_, thunkAPI) => {
        return CartServices.getCarts();
    }
);

interface CartsState {
    carts: ICart[] | null;
    status: string;
    error: string | null;
}

const initialStateCarts: CartsState = {
    carts: [],
    status: 'pending',
    error: null
}

export const cartsSlice = createSlice({
    name: 'carts',
    initialState: initialStateCarts,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCarts.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getCarts.fulfilled, (state, action) => {
                state.carts = action.payload.data
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getCarts.rejected, (state, action) => {
                state.status = 'rejected';
                state.carts = [];
                state.error = action.payload as string;
            })

    }
})

const cartsReducer = cartsSlice.reducer
// export const {
//
// } = cartsReducer.actions

export {initialStateCarts};

export default cartsReducer;