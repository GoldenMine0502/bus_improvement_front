import "./SelectBar.css"

function selectBar(props) {
    const onClickEvent = props.onButtonClick

    return (

        <div className="selectbar_background">
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent(0)}>All</button>
            <button className="custom-btn selectbar_button" onClick={() => onClickEvent(1)}>Only Map</button>
        </div>
    )
}

export default selectBar;