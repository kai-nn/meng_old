import React from 'react'
import { Navigate  } from 'react-router-dom';
import axios from "axios";
import {showMessage} from "../../../store/message/messageSlice";
import {useDispatch} from "react-redux";
import {killAccess} from "../../../store/access/accessSlice";

const Logout = () => {
    const dispatch = useDispatch()
    const api = async (url, param={}) => {
        const res = await axios.post(url, param)
        return res.data
    }

    api('logout')
        .then(data => {
            // console.log(data)
            dispatch(killAccess())
            dispatch(showMessage({
                visibility: true,
                type: data.type,
                text: data.message,
        }))
    })

    return (
        <Navigate to='/'/>
    )
}

export default Logout