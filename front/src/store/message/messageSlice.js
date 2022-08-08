import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    message: {},
    // visibility: false,
    // type: 'success',
    // text: ''
}

export const messageSlice = createSlice({
    name: 'msg',
    initialState,
    reducers: {
        showMessage: (state, action) => {
            state.message = action.payload
        }
    }
})

export const { showMessage } = messageSlice.actions
export default messageSlice.reducer