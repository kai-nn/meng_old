import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    shtat: null,
    menu: [
        {
            url: '',
            code: 111
        },
        // {
        //     url: 'detail',
        //     code: 111
        // },
        {
            url: 'review',
            code: 111
        },
        {
            url: 'equipment',
            code: 111
        },
        {
            url: 'login',
            code: 111
        },
        // {
        //     url: 'logout',
        //     code: 111
        // },
        {
            url: 'test_jwt',
            code: 111
        },
    ],
}

export const accessSlice = createSlice({
    name: 'access',
    initialState,
    reducers: {
        setAccess: (state, action) => {
            if(action.payload.access_token){
                // console.log('action.payload', action.payload)
                const token = action.payload.access_token
                const base64Url = token.split('.')[1]
                const base64 = decodeURIComponent(atob(base64Url)
                    .split('')
                    .map((c) => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    })
                    .join(''));
                const decodedToken = JSON.parse(base64)
                // console.log(decodedToken)

                state.token = action.payload.access_token
                state.user = decodedToken.user
                state.shtat = decodedToken.shtat
                state.menu = decodedToken.menu
            }
        },
        killAccess: () => initialState

    }
})

export const { setAccess, killAccess } = accessSlice.actions
export default accessSlice.reducer
