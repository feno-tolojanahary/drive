import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store';

interface DocState {
    currentKey: string
}

const initialState: DocState = {
    currentKey: ""
}

export const DocManagerSlice = createSlice({
    name: 'docManager',
    initialState,
    reducers: {
        setCurrentKey: (state, action: PayloadAction<string>) => {
            state.currentKey = action.payload;
        }
    }
})

export const { setCurrentKey } = DocManagerSlice.actions;

export const selectDocManager = (state: RootState) => state.docManager.currentKey;

export default DocManagerSlice.reducer;