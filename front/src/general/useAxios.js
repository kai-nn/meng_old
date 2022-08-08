import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {showMessage} from "../store/message/messageSlice";

function useAxios(url, method='get', value={}) {
    const [data, setData] = useState(null)
    const [err, setErr] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const token = useSelector(state => state.access.token)
    const dispatch = useDispatch()

    const changeData = (value) => {
        console.log('%c changeData', 'color: blue;')
        axios({
                url: url,
                method: method,
                data: {...value},
                headers: {Authorization: 'Bearer ' + token}
            })
            .then(res => {
                const d = res.data
                setData(d)
                setLoaded(true)

                if(!!d && !!d.message){
                    dispatch(showMessage({
                        visibility: true,
                        type: d.message.type,
                        text: d.message.message
                    }))
                }
            })
            .catch(e => {

                setErr(true)
                setLoaded(true)

                dispatch(showMessage({
                    visibility: true,
                    type: 'error',
                    text: 'Ошибка сети: ' + e.message
                }))
            })
    }

    useEffect(() => {
        changeData(value)
    }, [])

    return {data, err, loaded, changeData}
}

export default useAxios