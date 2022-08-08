import React from "react";
import {Alert, Snackbar} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {showMessage} from "../../store/message/messageSlice";
import style from './Message.module.scss'

const Message = () => {
    const dispatch = useDispatch()
    const message = useSelector(state => state.message.message)
    // console.log(message)
    const {visibility, type, text} = message
    const handleClose = () => {
        dispatch(showMessage({
            visibility: false,
            type: type,
            text: text,
        }))
    }

    return (
        <Snackbar
            style={{bottom: '50px'}}
            open={visibility}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical:'bottom', horizontal:'center' }} >
            <Alert onClose={handleClose} severity={type} >
                {text}
            </Alert>
        </Snackbar>
    )
}

export default Message