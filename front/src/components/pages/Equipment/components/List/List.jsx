import React, {useEffect, useState} from 'react'
import style from './List.module.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const List = ({data, sellected, setSellected}) => {

    let res = []
    let nesting = -1
    const [d, setD] = useState(data)

    const createTree = (object, parrent=1) => {
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
                    parrent: parrent,
                    is_group: is_group,
                }
            )
            if (collapsed){
                return
            }
            createTree(data[n-1], id)
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