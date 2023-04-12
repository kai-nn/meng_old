import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import io from "socket.io-client";


const initialState = {
    data: null,
    selected: 1,
}

// let endPoint = "http://localhost:5000"
// let socket = io.connect(`${endPoint}`)
// socket.on("equipmentСhange", response => {
//     console.log(response)
//     // sock(response)
// })
// const chenel = () => {
//     return store => {
//
//     }
// }


export const getEquipment = createAsyncThunk(
    'equipment/getEquipment',
    async (_, {rejectedWithValue, dispatch}) => {
        const response = await axios.get('equipment')
        const data = response.data

        // добавляем служебные поля
        const res = data.map(el => {
            return {
                ...el,
                collapsed: true,
                is_group: !!el.nodes.length,
                nesting: null,
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
    async (payload, {rejectedWithValue, dispatch}) => {
        // console.log('payload', payload)
        const response = await axios.post('equipment', {command: payload.command, selected: payload.selected})
        // console.log('response', response)
        return response.data
    }
)

export const deleteElem = createAsyncThunk(
    'equipment/delElem',
    async (payload, {rejectedWithValue, dispatch}) => {
        // console.log('payload', payload)
        const response = await axios.delete('equipment', {
            // headers: {
            //     Authorization: authorizationToken
            // },
            data: {
                command: 'delElem',
                selected: payload
            }
        })
        console.log('response', response)
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
        },
        collapsEl: (state, action) => {
            const id = action.payload
            const elem = state.data.find(el => el.id === id)
            elem.collapsed = !elem.collapsed
        },

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
            // state.data = action.payload
        },
        [createElem.rejected]: (state, action) => {
            // console.log('getEquipment.rejected')
        },



    }
})


export const {setSelected, changeData, collapsEl} = equipmentSlice.actions
export default equipmentSlice.reducer