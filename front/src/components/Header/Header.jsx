import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import style from './Header.module.scss'
import {
    Button,
    Avatar,
} from "@mui/material";
import {general_style} from "../../general/style";
import avatar from './images/avatar_1.jpg'
import {useSelector} from "react-redux";
import '../../store/access/accessSlice'
import {linkExtensions} from "./linkExtensions";



const Header = () => {

    const {pathname} = useLocation()
    const menuData = useSelector(state => state.access)
    const [links, setLinks] = useState([])
    console.log(menuData)

    const getIntersection = (menuData) => {
        let intersection = []
        menuData.menu.forEach(a =>
            linkExtensions.forEach( b => a.url === b.url && intersection.push(b) )
        )
        return intersection
    }


    useEffect(() => {
        setLinks(getIntersection(menuData))
    }, [menuData])


    return (
        <div className={style.window}>

            <div></div> {/* схлопывающиеся поля */}

            <div className={style.logo}>
                <span style={{color: 'orange'}}>micro</span>
                <span style={{color: 'midnightblue'}}>erp</span>
            </div>

            <div>
                {
                    links.map((el, i) => {
                        const {url, icon, label} = el
                        const st = pathname.slice(1) === url ? general_style.select : general_style.unselect
                        return (
                            <Link key={i} to={url}>
                                <Button
                                    value={url}
                                    style={st}
                                    >
                                    {icon}{label}
                                </Button>
                            </Link>
                        )
                    })
                }
            </div>

            <div className={style.role}>
                <div className={style.role__text}>
                    <span className={style.role__fio}>
                        {menuData.user && menuData.user.last_name + ' ' + menuData.user.first_name}
                    </span>
                    <span className={style.role__name}>
                        {menuData.shtat ? menuData.shtat.position : 'Гость'}
                    </span>
                </div>
                <Avatar
                    src={avatar}
                    style={{border: '1.6px solid white'}}
                    alt="avatar" />
            </div>

            <div></div> {/* схлопывающиеся поля */}
        </div>

    )
}


export default Header