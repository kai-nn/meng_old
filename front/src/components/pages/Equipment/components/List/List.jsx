import React, {useEffect, useState} from 'react'
import style from "./List.module.scss";



// const model = [
//     [2, 4, 8],
//     [3],
//     [],
//     [5, 6],
//     [],
//     [7],
//     [],
//     [],
// ]

const mod_data = [
    {id: 1, collapsed: 0, nodes: [2, 4, 8], name: 'Root'},
    {id: 2, collapsed: 0, nodes: [3], name: 'Приспособление'},
    {id: 3, collapsed: 0, nodes: [], name: 'Токарное'},
    {id: 4, collapsed: 0, nodes: [5, 6], name: 'Инструмент'},
    {id: 5, collapsed: 0, nodes: [], name: 'Резец'},
    {id: 6, collapsed: 0, nodes: [7], name: 'Сверло'},
    {id: 7, collapsed: 0, nodes: [], name: 'Спиральное'},
    {id: 8, collapsed: 0, nodes: [], name: 'Средство контроля'},
]




// const rend = (object) => {
//     object.nodes.map(n => {
//         console.log(mod_data[n-1].name)
//         if (mod_data[n-1].collapsed){
//             return
//         }
//         rend(mod_data[n-1])
//     })
// }
//
// rend(mod_data[0])



const List = ({data, sellected, setSellected}) => {

    let res = []
    let nesting = -1

    const createTree = (object) => {
        nesting++
        object.nodes.map(n => {
            const { id, name, type, collapsed } = data[n-1]
            res.push(
                {
                    id: id,
                    name: name,
                    type: type,
                    collapsed: collapsed,
                    nesting: nesting,
                }
            )
            if (collapsed){
                return
            }
            createTree(data[n-1])
        })
        nesting--
        return res
    }


    if(data != undefined) {
        res = []
        createTree(data[0])
    }

    const activate = (id) => {
        // console.log(id)
        setSellected(id)
    }



    return (
        <>
            {
                data != undefined &&
                res.map(el => {
                    const { id, name, type, collapsed, nesting } = el
                    const indent = nesting * 10 + 'px'
                    // console.log(id, sellected)
                    const sell = id === sellected
                        ? style.name_sellected
                        : style.name
                    return (
                        <div key={id}
                             className={style.str}
                             style={{marginLeft: indent}}
                             onClick={() => activate(id)}
                        >
                            <span className={sell}>{name}</span>
                            <span className={sell}>&#9660;</span>
                        </div>
                    )
                })
            }


            {/*{*/}
            {/*    data?.map( el => {*/}
            {/*        const {name, is_group, position} = el*/}
            {/*        const {num_position, num_str} = position*/}
            {/*        const indent = num_position * 10 + 'px'*/}
            {/*        const sell = num_str === sellected*/}
            {/*            ? style.name_sellected*/}
            {/*            : style.name*/}
            {/*        const node = is_group*/}
            {/*            ? <span className={style.node}>+</span>*/}
            {/*            : <span className={style.node}>&ensp;</span>*/}
            {/*        return(*/}
            {/*            <li className={style.str}*/}
            {/*                 key={num_str}*/}
            {/*                 style={{marginLeft: indent}}*/}
            {/*                 onClick={() => activate(num_str)}*/}
            {/*            >*/}
            {/*                {node}*/}
            {/*                <span className={sell}>{name}</span>*/}
            {/*            </li>*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}
        </>
    )
}

export default List