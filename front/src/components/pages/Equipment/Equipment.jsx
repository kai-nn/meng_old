import React, {useEffect, useState} from 'react'
import style from './Equipment.module.scss'
import List from "./components/List/List";
import Data from "./components/Data/Data";
import Submenu from "../../Submenu/Submenu";
import {useDispatch} from "react-redux";
import {getEquipment} from "../../../store/equipment/equipmentSlice";


const Equipment = () => {

    const dispatch = useDispatch()


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