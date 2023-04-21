import React from 'react'
import style from "../TestJWT.module.scss";
import Slider from '@mui/material/Slider';


const ControlPanel = (
    {
        setTimeTransformation,
        width,
        loadMaxMinMed,
        setFondValue,
        scale,
        setScale
    }
    ) => {

    const fondMarks = [
        {
            value: 164.4,
            label: 'месяц',
        },
        {
            value: 493.3,
            label: 'квартал',
        },
        {
            value: 986.5,
            label: 'полугодие',
        },
        {
            value: 1973,
            label: 'год',
        },
    ]

    const {loadMax, loadMin} = loadMaxMinMed

    const changeScale = (event, newScale) => {
        setScale(newScale)
        setTimeTransformation( (width-250)/loadMax * scale )
    }

    const changeFondValue = (event, newFondValue) => setFondValue(newFondValue)

    const getText = (fondValue) => fondValue



    return (
        <div className={style.control_panel}>
            <div style={{width: '150px'}}>
                Масштаб, %
                <Slider
                    onChange={changeScale}
                    value={scale}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={10}
                    max={300}
                />
            </div>
            <div style={{width: '300px'}}>
                Фонд, ч
                <Slider
                    min={fondMarks[0].value}
                    max={fondMarks[fondMarks.length - 1].value}
                    step={null}
                    marks={fondMarks}
                    onChange={changeFondValue}
                    valueLabelDisplay="auto"
                    getAriaValueText={getText}
                />
            </div>
        </div>
    )
}

export default ControlPanel