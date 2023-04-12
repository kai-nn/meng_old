import React from 'react'
import style from "../TestJWT.module.scss";
import {TRUE} from "sass";


const Workplaces = (
    {
        workplaces,
        fondValue
    }
    ) => {

    return (
        <div className={style.workplaces}>
            <div className={style.workplaces_str} style={{marginBottom: '10px', fontWeight: 'bold'}}>
                <div className={style.rm} title={'Рабочее место'}>Рабочее место</div>
                <div className={style.q}  title={'Количество'}>Кол.</div>
                <div className={style.s}  title={'Сменность'}>Кзаг.</div>
            </div>

            {
                Object.keys(workplaces).map((el, i) => {
                    const {wp_quantity, shift, loading, k_isp} = workplaces[el]
                    const calendarFond = fondValue * wp_quantity * shift * k_isp
                    const k_loading = (loading / 60 / calendarFond).toFixed(2)

                    let loadingColor
                    if (k_loading >= 1){
                        loadingColor = 'red'
                    } else if (k_loading > 0.8 && k_loading < 1){
                        loadingColor = 'orange'
                    } else if (k_loading <= 0.8){
                        loadingColor = 'green'
                    }

                    return (
                        <div key={`workplaces_${i}`} style={{height: '20px', color: loadingColor}}  className={style.workplaces_str}>
                            <div className={style.rm}>{el}</div>
                            <div className={style.q}>{wp_quantity}</div>
                            <div className={style.s}>{k_loading}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Workplaces