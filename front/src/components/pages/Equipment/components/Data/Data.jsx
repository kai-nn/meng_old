import React, {useEffect, useState} from 'react'
import style from "./Data.module.scss";

const Data = ({data, sellected}) => {

    const [output, setOutput] = useState(null)

    useEffect(() => {
        setOutput(data?.find(el => el.position.num_str === sellected))
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
                                <input type={'text'}
                                       value={output.name}
                                />
                                <input type={'text'}
                                       value={output.code ? output.code : ''}
                                />
                                <input type={'text'}
                                       value={output.description ? output.description : ''}
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