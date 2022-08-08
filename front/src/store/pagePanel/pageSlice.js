import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    label: 'empty',
    page: 1,
    pageCount: 1,
    listLen: 5,
    itemsCount: 1,
}

const pageSlice = createSlice({
    name: 'pagePanel',
    initialState,
    reducers: {
        setLabel: (state, action) => {
            state.label = action.payload
        },
        setPage: (state, action) => {
            state.page = action.payload
        },
        setPageCount: (state, action) => {
            state.pageCount = action.payload
        },
        setListLen: (state, action) => {
            state.listLen = action.payload
        },
        setItemsCount: (state, action) => {
            state.itemsCount = action.payload
        },
    }
})

export const {
    setLabel,
    setPage,
    setPageCount,
    setListLen,
    setItemsCount,
} = pageSlice.actions

export default pageSlice.reducer