import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";


const Data = ({data, sellected}) => {
    // console.log(data)
    return (
        <>
            {
                data && (

                    <div className={style.data}>

                        <div className={style.image}>
                            <img
                                src={'./img_store/' + data[sellected-1].path}
                                alt={'Нет картинки'}
                            />
                        </div>

                        <div className={style.input}>
                            <h4>Характеристики</h4>

                            <TextField
                                label="Наименование"
                                size="small"
                                value={data[sellected-1].name}
                            />
                            <TextField
                                label="Обозначение"
                                size="small"
                                value={data[sellected-1].code ? data[sellected-1].code : ''}
                            />
                            <TextField
                                label="Описание"
                                size="small"
                                value={data[sellected-1].description ? data[sellected-1].description : ''}
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