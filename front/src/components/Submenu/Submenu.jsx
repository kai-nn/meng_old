import React, {useEffect, useState} from 'react'
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
import {changeData, createElem, deleteElem, setSelected} from "../../store/equipment/equipmentSlice";
import io from "socket.io-client";

let endPoint = "http://localhost:5000"
let socket = io.connect(`${endPoint}`)


const Submenu = () => {

    const buttonState = {
        addElem: false,
        addSubElem: false,
        delElem: false,
        filter: false,
        done: false,
        cancel: false,
        allDisable: function(){
            Object
                .keys(this)
                .filter(el => el !== 'allDisable' && el !== 'allActivate')
                .forEach(key => this[key] = true)
        },
        allActivate: function(){
            Object
                .keys(this)
                .filter(el => el !== 'allDisable' && el !== 'allActivate')
                .forEach(key => this[key] = false)
        }
    }

    const selected = useSelector(state => state.equipment.selected)
    const data = useSelector(state => state.equipment.data)
    const dispatch = useDispatch()
    const [buttonActivation, setButtonActivation] = useState(buttonState)


    // server message
    socket.on("equipmentСhange", response => {
        // console.log('server message', response)
        let parrent = response.parrent

        if(response.command === 'addElem' || response.command === 'addSubElem') {
            let newElem = response.newElem

            parrent = {
                ...parrent,
                collapsed: false,
                is_group: true,
                nesting: null,
            }

            newElem = {
                ...newElem,
                collapsed: true,
                is_group: false,
                nesting: null,
            }
            console.log('data', data)
            if (data !== null) {
                let tempData = [...data]
                tempData[parrent.id - 1] = {...parrent}
                tempData[newElem.id - 1] = {...newElem}

                dispatch(changeData(tempData))
                // dispatch(setSelected(newElem.id))
            }
        }

        if(response.command === 'delElem'){
            if (data !== null) {
                // const old_parrent = data.find(el => !!el && el.id === parrent.id)
                const collapsed = !parrent.nodes.length
                // console.log('collapsed', collapsed)
                // console.log('delElem', '\nparrent', parrent, 'old_parrent', old_parrent)
                parrent = {
                    ...parrent,
                    collapsed: collapsed,
                    is_group: !collapsed,
                    nesting: null,
                }

                let tempData = [...data]
                tempData[parrent.id - 1] = {...parrent}
                dispatch(changeData(tempData))

                let autoSelect = parrent.id
                autoSelect = autoSelect === 1 && parrent.nodes[0]
                    ? parrent.nodes[0]
                    : autoSelect
                // console.log('selected', selected, autoSelect)
                dispatch(setSelected(autoSelect))
            }
        }

    })


    useEffect(() => {
        if (selected === 1){
            buttonState.allDisable()
            setButtonActivation(buttonState)
            buttonState.addSubElem = false
            setButtonActivation(buttonState)
        } else if (selected > 1) {
            buttonState.allActivate()
            setButtonActivation(buttonState)
        }
    }, [selected])


    const addElem = () => {
        console.log(selected)
        dispatch(createElem({command: 'addElem', selected: selected}))

        // // добавление элемента локально
        // let parrent = data.find(el => el.nodes.includes(selected) )
        // newElem.id = data.length + 1
        // const offsetNodes = parrent.nodes.indexOf(selected)
        // const tempParrentNodes = [
        //     ...parrent.nodes.slice(0, offsetNodes+1),
        //     newElem.id,
        //     ...parrent.nodes.slice(offsetNodes+1, parrent.nodes.length)
        // ]
        // parrent = {
        //     ...parrent,
        //     nodes: [...tempParrentNodes]
        // }
        // let tempData = [...data]
        // tempData[parrent.id-1] = {...parrent}
        // tempData = [...tempData, newElem]
    }


    const addSubElem = () => {
        console.log(selected)
        dispatch(createElem({command: 'addSubElem', selected: selected}))

        // // добавление вложенного элемента локально
        // newElem.id = data.length + 1
        // let parrent = data[selected - 1]
        // parrent = {
        //     ...parrent,
        //     collapsed: false,
        //     is_group: true,
        //     nodes: [...parrent.nodes, newElem.id ]
        // }
        // let tempData = [...data]
        // tempData[parrent.id-1] = {...parrent}
        // tempData = [...tempData, newElem]
        // dispatch(setSelected(newElem.id))
        // dispatch(changeData(tempData))
    }


    const delElem = () => {
        console.log('delete', selected)
        dispatch(deleteElem(selected))

        // локальая проверка вложенности элементов для предупреждения
        // let elementsToRemove = [selected]
        // const chainReaction = (obj) => {
        //     obj.nodes.map(n => {
        //         elementsToRemove.push(n)
        //         chainReaction(data[n - 1])
        //     })
        //     return elementsToRemove
        // }
        // elementsToRemove = chainReaction(data[selected-1])
        // const haveChildren = !data[selected-1].nodes.length
        // const deletion = haveChildren || window.confirm(`Элемент имеет вложенные элементы: ${elementsToRemove.length} Удалить?`)
        // if (!deletion) return
    }


    const cancel = () => {
        buttonState.allActivate()
        setButtonActivation(buttonState)
    }


    const done = () => {
        buttonState.allActivate()
        setButtonActivation(buttonState)

    }




    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={addElem} disabled={buttonActivation.addElem}>
                    <AddElem/>
                </IconButton>
                <IconButton onClick={addSubElem} disabled={buttonActivation.addSubElem}>
                    <AddSubElem/>
                </IconButton>
                <IconButton onClick={delElem} disabled={buttonActivation.delElem}>
                    <DelElem/>
                </IconButton>
                {/*<Divider orientation="vertical" flexItem />*/}
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}
                <IconButton disabled={buttonActivation.filter}>
                    <Filter />
                </IconButton>
                {/*<FilterAltOutlinedIcon style={{margin: '0 5px'}} fontSize="small" disabled={disabled}/>*/}

                <input className={style.input}
                       placeholder={'Фильтр'}
                       disabled={buttonActivation.filter && true}
                />

            </div>

            <div className={style.group_3}>
                {/*<Divider orientation="vertical" flexItem />*/}

                <IconButton onClick={done} disabled={buttonActivation.done}>
                    <CheckOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
                <IconButton onClick={cancel} disabled={buttonActivation.cancel}>
                    <ClearOutlinedIcon style={{margin: '0'}} fontSize="small"/>
                </IconButton>
            </div>


        </div>
    )
}

export default Submenu