import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import DoctorServices from "../services/DoctorServices";
import {defaultSearchOptions, ISearchOptions} from "../interfaces/commonInterfaces";
import {IDoctor} from "../interfaces/doctorInterfaces";

export const getDoctors = createAsyncThunk(
    'doctors/getDoctors',
    async (searchOptions: ISearchOptions, thunkAPI) => {
        return DoctorServices.getDoctors(searchOptions);
    }
);

interface DoctorsState {
    doctors: IDoctor[] | null;
    searchOptions: ISearchOptions;
    status: string;
    error: string | null;
}

const initialStateDoctors: DoctorsState = {
    doctors: [],
    searchOptions: defaultSearchOptions,
    status: 'pending',
    error: null
}

export const doctorsSlice = createSlice({
    name: 'doctors',
    initialState: initialStateDoctors,
    reducers: {
        setSearchOption: (state, action: PayloadAction<ISearchOptions>) => {
            state.searchOptions = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDoctors.pending, (state, action) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getDoctors.fulfilled, (state, action) => {
                state.doctors = action.payload.data
                state.status = 'fulfilled';
                state.error = null;
            })
            .addCase(getDoctors.rejected, (state, action) => {
                state.status = 'rejected';
                state.doctors = [];
                state.error = action.payload as string;
            })

    }
})

const doctorsReducer = doctorsSlice.reducer
export const {
    setSearchOption

} = doctorsSlice.actions

export {initialStateDoctors};

export default doctorsReducer