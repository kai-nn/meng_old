import React, {useEffect, useRef} from 'react'
import style from "../TestJWT.module.scss";
import Row from "./Row";


const Diagram = (
    {
        workplaces,
        tech_array,
        timeTransformation,
        setTimeTransformation,
        fondValue,
        scale,
        setScale,
        width,
        loadMaxMinMed
    }
    ) => {

    const overloadPosition = fondValue * timeTransformation

    const {loadMax, loadMin} = loadMaxMinMed

    const wheel = (event) => {
        // const delta = event.deltaY
        // if (delta > 0 && scale + 10 <= 300) {
        //     setScale(scale + 10)
        //     setTimeTransformation( (width-250)/loadMax * scale )
        // }
        // if (delta < 0 && scale - 10 >= 10) {
        //     setScale(scale - 10)
        //     setTimeTransformation( (width-250)/loadMax * scale )
        // }
        // console.log(scale)
    }

    return (
        <div className={style.diagram} onWheel={wheel}>
            <div className={style.diagram_header} style={{marginBottom: '10px', fontWeight: 'bold'}}>Загрузка</div>

            <div  className={style.diagram_load}>
                <div className={style.diagram_overload} style={{left: overloadPosition}}></div>
                {
                    Object.keys(workplaces).map( (w, i) =>
                        <Row
                            key={`row_${i}`}
                            workplaces={{...workplaces[w], wp: w}}
                            tech_array={tech_array}
                            timeTransformation={timeTransformation}
                        />
                    )
                }

            </div>
        </div>
    )
}

export default Diagram