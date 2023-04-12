import React, {useEffect, useRef, useState} from 'react'
import useAxios from "../../../general/useAxios";
import style from '../TestJWT/TestJWT.module.scss'
import Diagram from "./components/Diagram";
import Workplaces from "./components/Workplaces";
import ControlPanel from "./components/ControlPanel";
import useWindowDimensions from '../TestJWT/components/useWindowDimensions'
import {Skeleton} from "@mui/material";


const TestJWT = () => {

    const {data, err, loaded, changeData} = useAxios(
        'workplaces',
        'get',
        {mode: 'default'}
    )
    const [scale, setScale] = useState(10)
    const [workplaces, setWorkplaces] = useState(null)
    const [techArray, setTechArray] = useState(null)
    const [loadMaxMinMed, setLoadMaxMinMed] = useState(null)

    const [timeTransformation, setTimeTransformation] = useState(null)
    const [fondValue, setFondValue] = useState(164.4)

    const { height, width } = useWindowDimensions()



    useEffect(() => {
        if (loaded) {

            const {workplaces, tech_array} = data
            for (let wp in workplaces){
                workplaces[wp] = {
                    ...workplaces[wp],
                    loading: tech_array[wp].reduce((sum, tech) => sum + tech.tm_sum, 0)
                }
            }
            const load = Object.keys(workplaces).map(wp => workplaces[wp].loading / 60)
            const loadMax = Math.max.apply(null, load)
            const loadMin = Math.min.apply(null, load)
            const loadMaxMinMed = {
                loadMax: loadMax,
                loadMin: loadMin,
                med: (loadMax+loadMin)/2,
            }

            setWorkplaces(workplaces)
            setTechArray(tech_array)
            setLoadMaxMinMed(loadMaxMinMed)
            setTimeTransformation( (width-250)/loadMax * 10 )
        }
    }, [loaded])


    // const [indicatorPos, setIndicatorPos] = useState(null)
    //
    // const handleMouseOver = (event) => {
    //     setIndicatorPos(event.clientX - event.target.getBoundingClientRect().left)
    // }



    return (
        <>
            {/*<div*/}
            {/*    style={{position: 'relative', left: '100px', height: '50px', width: '500px', backgroundColor: 'red'}}*/}
            {/*    onMouseMove={event => handleMouseOver(event)}*/}
            {/*>*/}
            {/*    {indicatorPos}*/}
            {/*    {indicatorPos && <div style={{left: indicatorPos, height: '50%' , width: '1px', backgroundColor: 'black'}}></div>}*/}
            {/*</div>*/}
            {
                workplaces &&
                    <div className={style.frame}>

                        <ControlPanel
                            timeTransformation={timeTransformation}
                            setTimeTransformation={setTimeTransformation}
                            width={width}
                            loadMaxMinMed={loadMaxMinMed}
                            fondValue={fondValue}
                            setFondValue={setFondValue}
                            scale={scale}
                            setScale={setScale}
                        />
                        <div className={style.content}>
                            <Workplaces workplaces={workplaces} fondValue={fondValue} />
                            <Diagram
                                workplaces={workplaces}
                                tech_array={techArray}
                                timeTransformation={timeTransformation}
                                setTimeTransformation={setTimeTransformation}
                                loadMaxMinMed={loadMaxMinMed}
                                fondValue={fondValue}
                                scale={scale}
                                setScale={setScale}
                                width={width}
                            />
                        </div>

                    </div>
            }

            {!loaded && !err && (
                <div>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation="wave" />
                </div>
            )}

        </>
    )
}

export default TestJWT

