import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";
import TextField from "@mui/material/TextField";

const Data = ({data, sellected}) => {

    const [output, setOutput] = useState(null)

    useEffect(() => {
        setOutput(data?.find(el => el.id === sellected))
    }, [data, sellected])


    return (
        <>
            {
                output
                    ? (
                        <div className={style.data}>
                            <div className={style.image}>
                                <img
                                     src={'./img_store/' + output.path}
                                     alt={'Нет картинки'}
                                />
                            </div>
                            <div className={style.input}>
                                <h4>Характеристики</h4>

                                <TextField
                                  label="Деталь"
                                  size="small"
                                  defaultValue={output.name}
                                />
                                <TextField
                                  label="Название"
                                  size="small"
                                  defaultValue={output.code ? output.code : ''}
                                />
                                <TextField
                                  label="Обозначение технологии"
                                  size="small"
                                  defaultValue={output.description ? output.description : ''}
                                />

                                {/*<input type={'text'}*/}
                                {/*       defaultValue={output.name}*/}
                                {/*/>*/}
                                {/*<input type={'text'}*/}
                                {/*       defaultValue={output.code ? output.code : ''}*/}
                                {/*/>*/}
                                {/*<input type={'text'}*/}
                                {/*       defaultValue={output.description ? output.description : ''}*/}
                                {/*/>*/}
                            </div>

                        </div>
                    )
                    : (
                        <>
                            Данные отсутствуют!
                        </>
                    )
            }
        </>
    )
}

export default Data