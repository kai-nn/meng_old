import React, {useEffect, useState} from 'react'
import style from './List.module.scss'
import Submenu from "../../../../Submenu/Submenu";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



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

// const mod_data = [
//     {id: 1, collapsed: 0, nodes: [2, 4, 8], name: 'Root'},
//     {id: 2, collapsed: 0, nodes: [3], name: 'Приспособление'},
//     {id: 3, collapsed: 0, nodes: [], name: 'Токарное'},
//     {id: 4, collapsed: 0, nodes: [5, 6], name: 'Инструмент'},
//     {id: 5, collapsed: 0, nodes: [], name: 'Резец'},
//     {id: 6, collapsed: 0, nodes: [7], name: 'Сверло'},
//     {id: 7, collapsed: 0, nodes: [], name: 'Спиральное'},
//     {id: 8, collapsed: 0, nodes: [], name: 'Средство контроля'},
// ]




const List = ({data, sellected, setSellected}) => {

    let res = []
    let nesting = -1
    const [d, setD] = useState(data)

    const createTree = (object) => {
        nesting++
        object.nodes.map(n => {
            const { id, name, type, collapsed, is_group } = data[n-1]
            res.push(
                {
                    id: id,
                    name: name,
                    type: type,
                    collapsed: collapsed,
                    nesting: nesting,
                    is_group: is_group,
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
        setSellected(id)
    }

    const collaps = (id) => {
        data[id-1].collapsed = !data[id-1].collapsed
        res = []
        createTree(data[id-1])
        setD(data[id-1].collapsed)
    }




    return (
        <>


            {
                data != undefined &&
                res.map(el => {
                    const { id, name, type, collapsed, nesting, is_group } = el
                    const indent = nesting * 10 + 'px'
                    const sell = id === sellected
                        ? style.str_sellected
                        : style.str
                    return (
                        <div key={id}
                             className={sell}
                             style={{marginLeft: indent}}
                             onClick={() => activate(id)}
                        >
                            <span className={style.name}>{name}</span>
                            {
                                is_group && (
                                    !collapsed
                                        ? <span className={style.node} onClick={() => collaps(id)}><ExpandLessIcon fontSize="small"/></span>
                                        : <span className={style.node} onClick={() => collaps(id)}><ExpandMoreIcon fontSize="small"/></span>
                                )
                            }
                        </div>
                    )
                })
            }

        </>
    )
}

export default List