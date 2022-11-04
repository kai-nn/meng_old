import React, {useState} from 'react'
import style from './Submenu.module.scss';
import {Divider} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {ReactComponent as AddElem} from "./icon/addElem.svg";
import {ReactComponent as AddSubElem} from "./icon/addSubElem.svg";
import {ReactComponent as DelElem} from "./icon/delElem.svg";
import {ReactComponent as Filter} from "./icon/filter.svg";
import {useDispatch, useSelector} from "react-redux";
import {setList} from "../../store/equipment/equipmentSlice";


const Submenu = () => {

    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)
    const list = useSelector(state => state.equipment.list)
    const dispatch = useDispatch()

    const addElem = () => {
        console.log(selected)
        let parrent = list.find(el => el.nodes.includes(selected) )
        // console.log('parrent.nodes', parrent.nodes)

        const tempElem = {
            id: 999999,
            name: 'Новый',
            type: null,
            nodes: [],
            collapsed: true,
            nesting: parrent.nesting+1,
            parrent: parrent.id,
            is_group: false,
        }

        const offsetNodes = parrent.nodes.indexOf(selected)
        // console.log('offset', offset)

        const tempParrentNodes = [
            ...parrent.nodes.slice(0, offsetNodes+1),
            tempElem.id,
            ...parrent.nodes.slice(offsetNodes+1, parrent.nodes.length)
        ]
        // console.log(tempParrentNodes)
        parrent = {
            ...parrent,
            nodes: [...tempParrentNodes]
        }

        let tempList = list.map(el => el.id == parrent.id ? parrent : el)

        const offsetList = tempList.findIndex(el => el.id === selected)
        // console.log('offsetList', offsetList)

        tempList = [
            ...tempList.slice(0, offsetList+1),
            tempElem,
            ...tempList.slice(offsetList+1, tempList.length)
        ]
        // console.log('tempList', tempList)



        dispatch(setList(tempList))
    }



    const handleClick = (id) => {
        console.log(id)
        console.log(selected)
    }

    const disabled = false

    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={addElem} disabled={disabled}>
                    <AddElem/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <AddSubElem/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <DelElem/>
                </IconButton>
                {/*<Divider orientation="vertical" flexItem />*/}
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}
                <Filter style={{margin: '0 5px'}} />
                {/*<FilterAltOutlinedIcon style={{margin: '0 5px'}} fontSize="small" disabled={disabled}/>*/}

                <input className={style.input}
                       placeholder={'Фильтр'}
                       disabled={disabled && true}
                />

            </div>

            <div className={style.group_3}>
                {/*<Divider orientation="vertical" flexItem />*/}

                <IconButton onClick={handleClick}>
                    <CheckOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <ClearOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
            </div>


        </div>
    )
}

export default Submenu