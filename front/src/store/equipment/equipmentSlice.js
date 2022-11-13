import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";


const initialState = {
    data: null,
    selected: 2,
}


export const getEquipment = createAsyncThunk(
    'equipment/getEquipment',
    async (_, {rejectedWithValue, dispatch}) => {
        const response = await axios.get('equipment', {filter: '', page: 1, page_len: 10})
        const data = response.data

        // добавляем служебные поля
        const res = data.map(el => {
            return {
                ...el,
                collapsed: true,
                is_group: !!el.nodes.length,
                nesting: null,
                parrent: null,
            }
        })

        return res

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
        return response.data
    }
)

export const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,


    reducers: {
        changeData: (state, action) => {
            state.data = action.payload
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


export const {setSelected, changeData} = equipmentSlice.actions
export default equipmentSlice.reducer