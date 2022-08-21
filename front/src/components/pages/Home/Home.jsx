import React, {useState} from "react";
import {content} from './content'
import style from './Home.module.css'
import {Avatar} from "@mui/material";

const Home = () => {

    const [active, setActive] = useState(0)

    const sellect = (value) =>{
        console.log(value)
        setActive(value)
    }


    return (
        <>
            <div className={style.background}></div>

            <div className={style.foundation}>
                <div className={style.menu}>
                    {
                        content.map((el, ind) => {
                            return (
                                <div className={ind === active ? style.el_menu__active : style.el_menu}
                                    onClick={() => sellect(ind)}
                                     key={ind} >
                                    {el.elementMenu}
                                </div>
                            )
                        })
                    }
                </div>

                <div className={style.description}>
                    {
                        content.find((el, ind) => ind === active).body
                    }
                </div>
            </div>

        </>
    )
}

export default Home