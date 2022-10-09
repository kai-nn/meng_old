import React from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";


const Data = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)


    return (
        <>
            {
                data && (

                    <div className={style.data}>

                        <div className={style.image}>
                            <img
                                src={'./img_store/' + data[selected-1].path}
                                alt={'Нет картинки'}
                            />
                        </div>

                        <div className={style.input}>
                            <h4>Характеристики</h4>

                            <TextField
                                label="Наименование"
                                size="small"
                                value={data[selected-1].name}
                            />
                            <TextField
                                label="Обозначение"
                                size="small"
                                value={data[selected-1].code ? data[selected-1].code : ''}
                            />
                            <TextField
                                label="Описание"
                                size="small"
                                value={data[selected-1].description ? data[selected-1].description : ''}
                            />
                        </div>

                    </div>
                )
            }

            {!data && <>Данные отсутствуют!</>}
        </>
    )
}

export default Data