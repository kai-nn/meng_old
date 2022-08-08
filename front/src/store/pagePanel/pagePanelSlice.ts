import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@reduxjs/toolkit/dist/query/core/apiState";

interface IPage {
    label: string,
    page: number,
    pageCount: number,
    listLen: number,
}

const initialState:IPage = {
    label: 'empty',
    page: 1,
    pageCount: 1,
    listLen: 5,
}

export const pageSlice = createSlice({
    name: 'pagePanel',
    initialState,
    reducers: {
        setLabel: (state, action: PayloadAction<string>) => {
            state.label = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setPageCount: (state, action: PayloadAction<number>) => {
            state.pageCount = action.payload
        },
        setListLen: (state, action: PayloadAction<number>) => {
            state.listLen = action.payload
        },
    }
})

export const {
    setLabel,
    setPage,
    setPageCount,
    setListLen
} = pageSlice.actions

export const pagePanel = (state: RootState<any, any, any>) => state.pagePanel

export default pageSlice.reducer
