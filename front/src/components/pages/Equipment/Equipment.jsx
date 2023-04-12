import React, {useEffect} from 'react'
import style from './Equipment.module.scss'
import List from "./components/List/List";
import Data from "./components/Data/Data";
import Submenu from "../../Submenu/Submenu";
import {useDispatch, useSelector} from "react-redux";
import {changeData, getEquipment} from "../../../store/equipment/equipmentSlice";
import io from "socket.io-client";






const Equipment = () => {

    const dispatch = useDispatch()
    const data = useSelector(state => state.equipment.data)





    useEffect(() => {
        dispatch(getEquipment())
    }, [])


    return (
        <>
            <Submenu />

            <div className={style.frame}>
                <div className={style.list}>
                    <List />
                </div>
                <div className={style.data}>
                    <Data />
                </div>

            </div>
        </>
    )
}

export default Equipment