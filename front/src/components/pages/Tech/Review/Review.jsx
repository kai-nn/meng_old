import React, {useEffect, useState} from "react";
import style from './Review.module.scss'
import {
    Button,
    Divider,
    Skeleton,
} from '@mui/material';
import {Add} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import useAxios from "../../../../general/useAxios";
import PagePanel from "../../../PagePanel/PagePanel";
import AddTech from "./components/AddTech/AddTech";
import List from "./components/List/List";
import {setPageCount, setLabel, setItemsCount} from "../../../../store/pagePanel/pageSlice";


const Review = () => {

    const dispatch = useDispatch()
    const [addTech, setAddTech] = useState(false)
    const [techno, setTechno] = useState([])
    const [detail, setDetail] = useState([])

    const {label, page, pageCount, listLen, itemsCount} = useSelector(state => state.pagePanel)
    const {data, err, loaded, changeData} = useAxios(
        'list_tech',
        'post',
        {filter: '', page: page, page_len: listLen}
    )

    // PAGINATION и LIST: инициирование и обновление данных
    useEffect(() => {
        if(data) {
            dispatch(setLabel('Технологии в базе'))
            dispatch(setPageCount(data?.page_count))
            dispatch(setItemsCount(data?.tech_count))
            setTechno(data?.tech)
            setDetail(data?.detail)

            // console.log(data?.message)
        }
    }, [data])

    // обновление DATA по запросу
    useEffect(() => {
        loaded && changeData({filter: '', page: page, page_len: listLen})
    }, [page, listLen])




    // useEffect(() => {
    //     return console.warn('componentWillUnmount')
    // }, [])



    // console.log(
    //     'loaded', loaded,
    //     '\ntechno', techno,
    //     '\ndetail', detail,
    //     '\nlabel', label,
    //     '\npage', page,
    //     '\npageCount', pageCount,
    //     '\nlistLen', listLen,
    //     '\nitemsCount', itemsCount
    // )


    return (
        <div className={style.list}>

            {console.log('%c Review rendered', 'color: red')}
            <div className={style.sub_menu}>
                <Button onClick={() => setAddTech(true)} title="Добавить технологию">
                    <Add style={{margin: '0'}} />
                </Button>
                <Divider orientation="vertical" flexItem />
                <Button title="Только мои технологии">Мои</Button>
                <Button title="Все технологии">Все</Button>
                <Button title="Фильтровать технологии">
                    <SearchIcon style={{margin: '0'}} />
                </Button>
            </div>

            <PagePanel />

            <List detail={detail} techno={techno} />

            {!loaded && (
                <div>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation="wave" />
                </div>
            )}


            { addTech && <AddTech addTech={addTech} setAddTech={setAddTech} /> }

        </div>

    )
}

export default Review

