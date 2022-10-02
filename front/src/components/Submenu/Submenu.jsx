import React from 'react'
import style from './Submenu.module.scss';
import {Button, Divider} from "@mui/material";
import {Add} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsIcon from '@mui/icons-material/Directions';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const Submenu = () => {

    const add = () => {

    }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
      const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    return (
        <div className={style.sub_menu}>

            <div className={style.group_1}>
                <IconButton onClick={handleClick}>
                    <PlaylistAddIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <CreateNewFolderOutlinedIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <PlaylistRemoveOutlinedIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>
                <Divider orientation="vertical" flexItem />
            </div>

            <div className={style.group_2}>

                {/*<Divider orientation="vertical" flexItem />*/}

                <IconButton onClick={handleClick}>
                    <FilterAltOutlinedIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>

                <input className={style.input} placeholder={'Фильтр'}/>

            </div>

            <div className={style.group_3}>
                <Divider orientation="vertical" flexItem />

                <IconButton onClick={handleClick}>
                    <CheckOutlinedIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>
                <IconButton onClick={handleClick}>
                    <ClearOutlinedIcon style={{margin: '0'}} fontSize="small" color="primary"/>
                </IconButton>
            </div>


        </div>
    )
}

export default Submenu