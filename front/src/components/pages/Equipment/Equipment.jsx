import React, {useState} from 'react'
import useAxios from "../../../general/useAxios";
import style from './Equipment.module.scss'
import List from "./components/List/List";
import Data from "./components/Data/Data";
import Submenu from "../../Submenu/Submenu";

const Equipment = () => {
    const [sellected, setSellected] = useState(2)
    const {data, err, loaded, changeData} = useAxios(
        'equipment',
        'get',
        {filter: '', page: 1, page_len: 10}
    )
    return (
        <>
            <Submenu />

            <div className={style.frame}>
                <div className={style.list}>
                    <List
                      data={data}
                      sellected={sellected}
                      setSellected={setSellected}
                    />
                </div>
                <div className={style.data}>
                   <Data
                      data={data}
                      sellected={sellected}
                    />
                </div>

            </div>
        </>
    )
}

export default Equipment