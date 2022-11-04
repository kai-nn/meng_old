import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";


const initialState = {
    data: null,
    list: null,
    selected: 2,
}


export const getEquipment = createAsyncThunk(
    'equipment/getEquipment',
    async (_, {rejectedWithValue, dispatch}) => {
        const response = await axios.get('equipment', {filter: '', page: 1, page_len: 10})
        // console.log(response)
        return response.data

        // dispatch(setEquipment(response.data))
        // async function(){
        //     const response = await fetch('equipment')
        //     const data = await response.json()
        //     return data
    }
)

export const createElem = createAsyncThunk(
    'equipment/createElem',
    async (_, {rejectedWithValue, dispatch}) => {
        const response = await axios.post('equipment', {name: 'new elem'})
        // console.log(response)
        return response.data
    }
)

export const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,


    reducers: {
        changeData: (state, action) => {
            const value = state.data.find(el => el.id === action.payload.id)
            value.collapsed = !value.collapsed
        },
        setList: (state, action) => {
            // console.log('changeData', action)
            state.list = action.payload
        },
        setSelected: (state, action) => {
            state.selected = action.payload
        }
    },


    extraReducers: {

        [getEquipment.pending]: (state, action) => {
            // console.log('getEquipment.pending')
        },
        [getEquipment.fulfilled]: (state, action) => {
            // console.log('getEquipment.fulfilled')
            // console.log('getEquipment.state', action)
            state.data = action.payload
        },
        [getEquipment.rejected]: (state, action) => {
            // console.log('getEquipment.rejected')
        },


        [createElem.pending]: (state, action) => {
            // console.log('getEquipment.pending')
        },
        [createElem.fulfilled]: (state, action) => {
            console.log('createElem.fulfilled')
            // console.log('getEquipment.state', action)
            state.data = action.payload
        },
        [createElem.rejected]: (state, action) => {
            // console.log('getEquipment.rejected')
        },



    }
})


export const {setSelected, changeData, setList} = equipmentSlice.actions
export default equipmentSlice.reducer