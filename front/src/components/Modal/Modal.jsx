import React, {useState} from "react";
import './Modal.scss'


const Modal = ({setActive, header, children, footer}) => {

    const [toggle, setToggle] = useState('curtain open')

    const closeModal = () => {
        setToggle('curtain close')
        setTimeout(() => {
            setActive(false)
        }, 500)
    }

    return (
        <div className={toggle} onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">{header}</div>
                <div className="modal__body">{children}</div>
                <div className="modal__footer">{footer}</div>
            </div>
        </div>
    )
}

export default Modal