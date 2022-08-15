import React, {useEffect, useState} from 'react'
import {useDispatch} from "react-redux";
import {showMessage} from "../../../store/message/messageSlice";
import useAxios from "../../../general/useAxios";


const TestJWT = () => {

    const dispatch = useDispatch()
    const [temp, setTemp] = useState(Date.now)
    const param = {filter: '', page: 1, page_len: 5}
    const {data, err, loaded, changeData} = useAxios(
        'test_jwt',
        'post',
        param
    )


    useEffect(() => {
        if(data) {
            const {type, message} = data
            dispatch(showMessage({
                visibility: true,
                type: type,
                text: message
            }))
        }
    }, [data])

    const click = () => {
        setTemp(Date.now)
        changeData({user: 'Aleksander', login: 'kai'})
    }


    return (
        <div>
            <br />
            <p>TestJWT</p><button type="button" onClick={() => click()}>{temp}</button>
            <br/>
            {data && data.message}
            {err && err.message}
            <img src={'./img_store/' + 'ksiuha.jpg'}/>
        </div>
    )
}

export default TestJWT