import React, {useEffect} from "react";
import style from './Footer.module.scss'
import useAxios from "../../general/useAxios";
import {useGeoData} from "../../general/useGeoData";
import PublicIcon from '@mui/icons-material/Public';


const Footer = () => {
    let position = ''
    const {coord} = useGeoData()
    const {data, err, loaded, changeData} = useAxios(
        'location',
        'post',
        coord
    )

    useEffect(() => {
        changeData(coord)
    }, [coord])

    // console.log('data', !!data && data[0]?.value)

    if(!!data && data[0]?.value){
        position = <><PublicIcon className={style.icon} /><span>{data[0]?.value}</span></>
    } else {
        position = <><PublicIcon className={style.icon_dontactive} /></>
    }

    return (
        <div className={style.window} title='Панель служебной информации'>
            {position}
        </div>
    )
}

export default Footer