import React, {FC} from "react";
import style from './TechStr.module.css'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

interface ITechStr {
    name: string;
    version: string;
    title: string;
    status: React.ReactNode | string;
    clickable?: boolean;
}

const TechStr: FC<ITechStr> = ({name, version, title, status, clickable}) => {
    const clickableClass = clickable ? style.clickable : ''
    return (
        <div className={`${style.str} ${clickableClass}`}>
            <div>{name}</div>
            <div>{version}</div>
            <div>{title}</div>
            {
                (() => {
                    switch (status) {
                        case 'edit': return <div style={{textAlign: 'right'}} title={'На редактировании'}><ModeEditOutlineOutlinedIcon /></div>;
                        case 'approve': return <div style={{textAlign: 'right'}} title={'Утвержден'}><CheckBoxOutlinedIcon /></div>;
                        case 'archive': return <div style={{textAlign: 'right'}} title={'В архиве'}><Inventory2OutlinedIcon /></div>;
                        default: return <div style={{textAlign: 'right'}}>{status}</div>;
                    }
                })()
            }
        </div>
    )
}

export default TechStr