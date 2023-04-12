import React from 'react'
import style from '../TestJWT.module.scss'


const Row = (
    {
        workplaces,
        tech_array,
        timeTransformation,
    }
    ) => {

    const {wp, wp_quantity, shift, k_isp, fond} = workplaces
    let row

    if(tech_array[wp].length){
        row = tech_array[wp].map((tech, i) => {
            const block = {
                minWidth: tech.tm_sum / (60 * wp_quantity * shift) * k_isp * timeTransformation,
                height: '20px',
                border: '1px solid grey',
                backgroundColor: 'palegreen',
            }
            const title = tech.drawing + ' ' + tech.name

            return <div key={`block_${wp}_${i}`} style={block} title={title}></div>
        })
    } else {
        const block = {height: '20px'}
        row = <div style={block}></div>
    }

    return <div className={style.row}>{row}</div>
}


export default Row