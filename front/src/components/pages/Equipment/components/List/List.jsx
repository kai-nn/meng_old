import React from 'react'
import style from './List.module.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {setSelected, changeData, collapsEl} from "../../../../../store/equipment/equipmentSlice";


const List = () => {

    const dispatch = useDispatch()
    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)

    // console.log('data', data)
    function createList(object) {
        let res = [object]
        let nesting = -1
        const chainReaction = (object) => {
            nesting++
            object.nodes.map(n => {
                // console.log('data[n]', data[n])
                const elem = data.find(el => !!el && el.id === n)
                // console.log('elem', elem)
                const { id, collapsed } = elem
                const tempDataElem = { ...elem }
                tempDataElem.nesting = nesting
                res.push( tempDataElem  )
                if (collapsed) return

                chainReaction(tempDataElem)
            })
            nesting--
            return res
        }
        return chainReaction(object)
    }


    const activate = (id) => {
        console.log('activate.id', id)
        dispatch(setSelected(id))
    }


    const collaps = (id) => {
        dispatch(collapsEl(id))
    }



    return (
        <>
            {
                data &&
                data.length &&
                createList(data[0]).filter(el => el.name != 'Root').map(el => {
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