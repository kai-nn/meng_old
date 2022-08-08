import React, {FC, useState} from "react";
import {Backdrop, createStyles, Fade, makeStyles, Modal, Theme} from "@mui/material";
import style from './ModalAdd.module.scss'

interface IProps {
    op: boolean
}




const ModalAdd:FC<IProps> = ({op= false}) => {
    console.log(op)
  const [open, setOpen] = useState(op);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };




 return (
    <div>
      {/*<button type="button" onClick={handleOpen}>*/}
      {/*  react-transition-group*/}
      {/*</button>*/}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={style.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={style.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">react-transition-group animates me.</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalAdd;