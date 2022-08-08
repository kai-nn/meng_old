import React, {useEffect, useState} from "react";
import style from "../PagePanel/PagePanel.module.scss";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import { Pagination } from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setPage, setPageCount, setListLen, setLabel} from '../../store/pagePanel/pageSlice'



const PagePanel = () => {
    const dispatch = useDispatch()
    const {label, page, pageCount, listLen, itemsCount} = useSelector((state:any) => state.pagePanel)
    // const maxPage
    // const [maxPage, setMaxPage] = useState(1)
    const changePage = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        dispatch(setPage(value))
    }

    const changeListLen = (
        event: SelectChangeEvent<number>,
    ) => {
        dispatch(setListLen(Number(event.target.value)))
    }

    // useEffect(() => {
    //     const mP = Math.ceil(itemsCount / listLen)
    //     console.log(mP)
    //     setPage(mP)
    // }, [listLen])



    return (
        <div className={style.head}>
            <b>{label}</b>
            <div className={style.paginator}>
                <Pagination count={pageCount} color="primary" onChange={changePage} />
                <Select value={listLen} size="small" onChange={e => changeListLen(e)}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
            </div>
        </div>
    )
}

export default PagePanel