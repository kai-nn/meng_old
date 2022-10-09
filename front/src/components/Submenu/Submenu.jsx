import React, {useState} from 'react'
import style from './Submenu.module.scss';
import {Divider} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const Submenu = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    // const open = Boolean(anchorEl);
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    const handleClick = (id) => {
        console.log(id)
        // setAnchorEl(event.currentTarget);
    }


    const disabled = false
    // const elem = () => (<PlaylistAddIcon/>)

    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={() => handleClick('addElem')} disabled={disabled}>
                    <PlaylistAddIcon fontSize="small" color={disabled ? 'disabled' : 'primary'}/>
                    {/*<PlaylistAddIcon fontSize="small" color={disabled ? 'disabled' : 'primary'}/>*/}
                </IconButton>
                <IconButton id={'addFolder'} onClick={handleClick}>
                    <CreateNewFolderOutlinedIcon fontSize="small"/>
                </IconButton>
                <IconButton  onClick={handleClick}>
                    <PlaylistRemoveOutlinedIcon fontSize="small"/>
                </IconButton>
                <Divider orientation="vertical" flexItem />
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}

                <FilterAltOutlinedIcon style={{margin: '0 5px'}} fontSize="small"/>

                <input className={style.input}
                       placeholder={'Фильтр'}
                       disabled={disabled && true}
                />

            </div>

            <div className={style.group_3}>
                <Divider orientation="vertical" flexItem />

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