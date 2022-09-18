import React from 'react'
import style from "./List.module.scss";

const List = ({data, sellected, setSellected}) => {
    const activate = (num_str) => {
        setSellected(num_str)
    }
    return (
        <>
            {
                data?.map( el => {
                    const {name, is_group, position} = el
                    const {num_position, num_str} = position
                    const indent = num_position * 10 + 'px'
                    const sell = num_str === sellected
                        ? style.name_sellected
                        : style.name
                    const node = is_group
                        ? <span className={style.node}>+</span>
                        : <span className={style.node}>&ensp;</span>
                    return(
                        <li className={style.str}
                             key={num_str}
                             style={{marginLeft: indent}}
                             onClick={() => activate(num_str)}
                        >
                            {node}
                            <span className={sell}>{name}</span>
                        </li>
                    )
                })
            }
        </>
    )
}

export default List