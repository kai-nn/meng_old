import {useSelector} from "react-redux";
import axios from "axios";
import {useEffect, useState} from "react";


export const useApi = (
        url:string,
        method:string = 'get',
        data:{} | null = null,
     ) => {

    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown | null>(null)

    const token = useSelector((state: any) => state.access.token)

    // useEffect(() => {
    //     console.log(123)
    //     if (!result) {
    //         try {
    //             axios(
    //                 url,
    //                 {
    //                     method,
    //                     data,
    //                     headers: {Authorization: 'Bearer ' + token}
    //                 })
    //                 .then((d) => {
    //                     setResult(d.data)
    //                     setLoading(false)
    //                 })
    //         }
    //         catch (e) {
    //             setError('Ошибка в получении данных')
    //         }
    //     }
    // }, [])

    useEffect(() => {
        if(!url){
            console.log('url отсутствует')
            return
        }
        const fetchData = async () => {
            const res = await axios(
                url,
                {
                    method,
                    data,
                    headers: {Authorization: 'Bearer ' + token}
                })
            const d = await res.data
            console.log('d', d)
            setResult(d)
        }
        fetchData()

    }, [])



    return [ result, setResult, loading, error ]
}

