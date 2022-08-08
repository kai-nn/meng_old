import React, {FC} from "react";
import {Link, useLocation} from "react-router-dom";
import style from './Header.module.scss'
import {
    Button,
    Avatar,
} from "@mui/material";
import {general_style} from "../../general/style";
import avatar from './images/avatar_1.jpg'

interface ILink {
    label: string;
    url: string;
    icon: React.ReactNode
}
interface ILinks {
    links: ILink[]
}

const Header:FC<ILinks> = ({links}) => {

    const {pathname} = useLocation()
    // console.log(pathname)

    return (
        <div className={style.window}>

            <div></div> {/* адаптивные поля для правильной работы Grid */}

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
                    <span className={style.role__fio}>Александр Корпусов</span>
                    <span className={style.role__name}>Администратор</span>
                </div>
                <Avatar
                    src={avatar}
                    style={{border: '1.6px solid white'}}
                    alt="avatar" />
            </div>

            <div></div> {/* адаптивные поля для правильной работы Grid */}
        </div>

    )
}


export default Header