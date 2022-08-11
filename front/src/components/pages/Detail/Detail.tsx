import { Alert } from "@mui/material";
import React from "react";
import style from "./Detail.module.css";
import WorldSpinner from "../../WorldSpinner/WorldSpinner";

const Detail = () => {
    return (
        <div className={style.window}>
            <div className={style.baner}>
                <WorldSpinner/>
                <Alert severity="warning">Страница ввода деталей в разработке...</Alert>
            </div>
        </div>
    )
}

export default Detail