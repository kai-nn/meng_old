import React from "react";
import {Alert} from "@mui/material";
import style from './Home.module.css'
import WorldSpinner from "../../WorldSpinner/WorldSpinner";

const Home = () => {
    return (
        <div className={style.window}>
            <div className={style.baner}>
                <WorldSpinner/>
                <Alert severity="warning">Главная страница в разработке...</Alert>
            </div>
        </div>
    )
}

export default Home