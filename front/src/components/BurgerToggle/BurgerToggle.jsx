import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

const BurgerToggle = ({press, setPress}) => {

    const active = () => {
        setPress(!press)
    }

    return (
        <div>
            {!press ? <MenuIcon onClick={active} /> : <ClearIcon onClick={active} />}
        </div>
    )
}

export default BurgerToggle