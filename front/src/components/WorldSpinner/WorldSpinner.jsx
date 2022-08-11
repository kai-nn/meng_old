import React from 'react'
import './style.css'

const WorldSpinner = () => {
    return (
        <div className="globe">
            <div className="globe-sphere"></div>
            <div className="globe-outer-shadow"></div>
            <div className="globe-worldmap">
                <div className="globe-worldmap-back"></div>
                <div className="globe-worldmap-front"></div>
            </div>
            <div className="globe-inner-shadow"></div>
        </div>
    )
}

export default WorldSpinner