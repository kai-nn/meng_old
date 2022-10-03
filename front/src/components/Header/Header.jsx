import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import style from './Header.module.scss'
import {
    Button,
    Avatar,
} from "@mui/material";
import {general_style} from "../../general/style";
import {useSelector} from "react-redux";
import '../../store/access/accessSlice'
import {linkExtensions} from "./linkExtensions";
import BurgerToggle from "../BurgerToggle/BurgerToggle";
import IconButton from "@mui/material/IconButton";
// import {useNavigate} from "react-router";




const Header = () => {

    const {pathname} = useLocation()
    const navigate = useNavigate();
    const menuData = useSelector(state => state.access)
    const [links, setLinks] = useState([])
    const [avatar, setAvatar] = useState('')

    const [press, setPress] = useState(false)

    window.onresize = () => setPress(false)

    const getIntersection = (menuData) => {
        let intersection = []
        menuData.menu.forEach(a =>
            linkExtensions.forEach( b => a.url === b.url && intersection.push(b) )
        )
        // console.log(intersection)
        return intersection
    }


    useEffect(() => {
        setLinks(getIntersection(menuData))
        menuData.user ? setAvatar('./img_store/' + menuData.user.path) : setAvatar('')
    }, [menuData])


    return (
        <div className={press ? style.window_activated : style.window}>

            <div className={style.logo}>
                <span style={{color: 'orange'}}>micro</span>
                <span style={{color: 'midnightblue'}}>erp</span>
            </div>

            <div className={press ? style.links_activated : style.links}>
                {
                    links.map((el, i) => {
                        const {url, icon, label} = el
                        const st = pathname.slice(1) === url ? general_style.select : general_style.unselect
                        return (
                            <Link key={i} to={url} onClick={() => setPress(false)}>
                                <IconButton
                                    value={url}
                                    style={st}
                                    >
                                    <span className={style.icon}>{icon}</span>
                                    <span className={style.label}>{label}</span>
                                </IconButton>
                            </Link>
                        )
                    })
                }
            </div>

            <div className={press ? style.role_activated : style.role}>
                <div className={style.role__text} onClick={() => setPress(false)}>
                    <span className={style.role__fio}>
                        {menuData.user && menuData.user.last_name + ' ' + menuData.user.first_name}
                    </span>
                    <span className={style.role__name}>
                        {menuData.shtat ? menuData.shtat.position : <a onClick={() => navigate('/login')} style={{cursor: 'pointer', fontSize: '1.4em', color: 'white'}}>Войти</a>}
                    </span>
                </div>
                <Avatar
                    className={style.avatar}
                    src={avatar}
                    style={{border: '1.6px solid white'}}
                    alt="avatar" />
            </div>

            <div className={style.burger}>
                <BurgerToggle press={press} setPress={setPress}/>
            </div>


        </div>

    )
}


export default Header