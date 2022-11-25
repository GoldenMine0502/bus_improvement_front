import React, {useEffect, useState} from 'react'

import "./SelectBar.css"
import "./InputText.css"

function SelectBar(props) {
    const onClickEvent = props.onButtonClick
    const onRouteNumberTextChanged = props.onRouteNumberTextChanged

    return (
        <div className="selectbar_background">
            <div style={{margin: "30px 0px", fontSize: "38px"}}>Bus<br/>Improvement<br/>Simulation</div>

            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('all')}>All</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('allbig')}>All(bigger)</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('original')}>Original</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('shortest')}>Shortest</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('optimized')}>Optimized</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent('shortestall')}>Shortest All</button>

            <div className="empty_margin"/>
            {/*<input type="text"/>*/}
            <div className="col-3 input-effect">
                <input className="effect-20" type="text" placeholder=" " onChange={onRouteNumberTextChanged}/>
                <label>Route Number...</label>
                <span className="focus-border"><i></i></span>
            </div>
        </div>
    )
}

export default SelectBar;