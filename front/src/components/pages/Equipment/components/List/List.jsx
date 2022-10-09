import React, {useEffect} from 'react'
import style from './List.module.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {setList, setSelected, changeData} from "../../../../../store/equipment/equipmentSlice";


const List = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)
    const list = useSelector(state => state.equipment.list)


    function createList(object) {
        let res = []
        let nesting = -1
        const chainReaction = (object, parrent = 1) => {
            nesting++
            object.nodes.map(n => {
                const {id, name, type, collapsed, is_group} = data[n - 1]
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
                if (collapsed) {
                    return
                }
                chainReaction(data[n - 1], id)
            })
            nesting--
            return res
        }
        return chainReaction(object)
    }


    useEffect(() => {
        console.log('selected')
    }, [selected])


    // активация списка
    useEffect(() => {
        // console.log('data activation', data)
        data && data.length && dispatch(setList( createList(data[0]) ))
    }, [data])


    const activate = (id) => {
        dispatch(setSelected(id))
    }

    const collaps = (id) => {
        dispatch(changeData( data[id - 1] ))
    }


    return (
        <>
            {
                list?.map(el => {
                    const { id, name, type, collapsed, nesting, is_group } = el
                    const indent = nesting * 10 + 'px'
                    const sell = id === selected
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