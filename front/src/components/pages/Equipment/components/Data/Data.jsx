import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";

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
                                     // width={'300px'}
                                     src={'./img_store/' + output.path}
                                     alt={'Нет картинки'}
                                />
                            </div>
                            <div className={style.input}>
                                <h4>Характеристики</h4>
                                <input type={'text'}
                                       defaultValue={output.name}
                                />
                                <input type={'text'}
                                       defaultValue={output.code ? output.code : ''}
                                />
                                <input type={'text'}
                                       defaultValue={output.description ? output.description : ''}
                                />
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