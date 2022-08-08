import {createSlice} from '@reduxjs/toolkit'

export const accessSlice = createSlice({
    name: 'access',
    initialState: {
        token: {},
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setToken } = accessSlice.actions
export default accessSlice.reducer
