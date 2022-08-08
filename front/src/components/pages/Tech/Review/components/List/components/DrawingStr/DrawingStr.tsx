import React, {FC} from "react";
import style from './DrawingStr.module.css'

interface IDrawingStr {
    drawing: string,
    children?: React.ReactNode
}

const DrawingStr: FC<IDrawingStr> = ({
     drawing,
     children
    }) => {

    return (
        <>
            <div className={style.str}>{drawing}</div>
            <div>{children}</div>
        </>
    )
}

export default DrawingStr