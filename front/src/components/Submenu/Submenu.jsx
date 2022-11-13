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
import {changeData, setSelected} from "../../store/equipment/equipmentSlice";


// const arr = [
//     {id: 1, nodes: [2, 4]},
//     {id: 2, nodes: [5]},
//     {id: 3, nodes: []},
//     {id: 4, nodes: []},
//     {id: 5, nodes: []},
// ]
// console.log('arr', arr)
//
//
// let re = []
// const reaction = (obj) => {
//     obj.nodes.map(n => {
//         re.push(n)
//         reaction(arr[n - 1])
//     })
//     return re
// }
// console.log('Удаляемые элементы', reaction(arr[0]))
//
// let tempArr = arr.filter(el => !re.includes(el.id) )
// console.log('tempArr', tempArr)


const Submenu = () => {

    const newElem = {
        id: null,
        type: null,
        name: 'Новый',
        description: null,
        code: null,
        firm: null,
        path: null,
        data_added: null,

        nodes: [],
        options: null,

        relevance: null,
        added_id: null,

        collapsed: true,
        is_group: false,

        nesting: null,
        parrent: null,
    }
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

        // buttonState.allDisable()
        // setButtonActivation(buttonState)

        // зарегистрировать в API id нового элемента и записать его в newElem!

        let parrent = data.find(el => el.nodes.includes(selected) )
        // console.log('parrent.nodes', parrent.nodes)

        newElem.id = data.length + 1
        // console.log('newElem', newElem)
        const offsetNodes = parrent.nodes.indexOf(selected)
        // console.log('offsetNodes', offsetNodes)

        const tempParrentNodes = [
            ...parrent.nodes.slice(0, offsetNodes+1),
            newElem.id,
            ...parrent.nodes.slice(offsetNodes+1, parrent.nodes.length)
        ]
        // console.log(tempParrentNodes)
        parrent = {
            ...parrent,
            nodes: [...tempParrentNodes]
        }
        // console.log('parrent', parrent)

        let tempData = [...data]
        tempData[parrent.id-1] = {...parrent}
        // console.log('tempData[parrent.id]', tempData[parrent.id])
        tempData = [...tempData, newElem]
        // console.log('tempData', tempData)

        dispatch(setSelected(newElem.id))
        dispatch(changeData(tempData))
    }

    const addSubElem = () => {
        // console.log(selected)

        // buttonState.allDisable()
        // setButtonActivation(buttonState)

        newElem.id = data.length + 1
        // console.log('newElem', newElem)

        let parrent = data[selected - 1]
        parrent = {
            ...parrent,
            collapsed: false,
            is_group: true,
            nodes: [...parrent.nodes, newElem.id ]
        }
        // console.log('parrent', parrent)

        let tempData = [...data]
        tempData[parrent.id-1] = {...parrent}
        // console.log('tempData[parrent.id]', tempData[parrent.id])
        tempData = [...tempData, newElem]
        // console.log('tempData', tempData)

        dispatch(setSelected(newElem.id))
        dispatch(changeData(tempData))
    }

    const delElem = () => {
        console.log(selected)

        let elementsToRemove = [selected]
        const chainReaction = (obj) => {
            obj.nodes.map(n => {
                elementsToRemove.push(n)
                chainReaction(data[n - 1])
            })
            return elementsToRemove
        }
        elementsToRemove = chainReaction(data[selected-1])
        // console.log('Удаляемые элементы', elementsToRemove)
        const haveChildren = !data[selected-1].nodes.length
        const deletion = haveChildren || window.confirm(`Элемент имеет вложенные элементы: ${elementsToRemove.length} Удалить?`)

        if (!deletion) return

        let parrent = data.find(el => el.nodes.includes(selected) )
        // console.log('parrent.nodes', parrent.nodes)

        // const offsetNodes = parrent.nodes.indexOf(selected)
        // console.log('offsetNodes', offsetNodes)

        const tempParrentNodes = [...parrent.nodes.filter(el => el !== selected)]
        // console.log('tempParrentNodes', tempParrentNodes)

        parrent = {
            ...parrent,
            is_group: !!tempParrentNodes.length,
            nodes: [...tempParrentNodes]
        }
        // console.log('parrent', parrent)

        // console.log('Удаляем...')
        const tempData = [...data]
        // elementsToRemove.forEach(el => delete tempData[el-1])
        // const tempData = data.filter(el => !elementsToRemove.includes(el.id) )
        // let tempData = [...data.filter(el => el.id !== selected)]
        tempData[parrent.id-1] = {...parrent}
        // console.log('tempData', tempData)

        let autoSelect = parrent.id
        autoSelect = autoSelect === 1 && parrent.nodes[0]
            ? parrent.nodes[0]
            : autoSelect

        dispatch(setSelected(autoSelect))
        dispatch(changeData(tempData))

    }

    const cancel = () => {
        buttonState.allActivate()
        setButtonActivation(buttonState)
    }

    const done = (id) => {
        console.log(id)
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