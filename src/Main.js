import React, {useEffect, useState} from 'react'
import {getServerURL} from "./URLUtil";
import poly from "proj4/lib/projections/poly";
import SelectBar from "./SelectBar";
import "./Main.css"
import AllRender from "./rendertypes/AllRender";
import NoRender from "./rendertypes/NoRender";
import SpecificRender from "./rendertypes/SpecificRender";

const INU_LATITUDE = 37.3751;
const INU_LONGITUDE = 126.6328;

const { kakao, proj4 } = window;

let map = null;
const mapObjects = [];
let lastDragEndEvent = null;

function Main() {
    const [renderIndex, setRenderIndex] = useState(0)
    const [routeNo, setRouteNo] = useState("")

    const renderMap = async (map) => {
        switch (renderIndex) {
            case 0:
            default:
                AllRender(map, mapObjects)
                break;
            case 1:
                NoRender(map, mapObjects)
                break;
            case 2:
                SpecificRender(map, mapObjects, "shortestroute", routeNo)
                break;
            case 3:
                SpecificRender(map, mapObjects, "optimizedroute", routeNo)
                break;
        }
    }

    const createMap = (markers) => {
        const container = document.getElementById('map');
        const options = {
            // 인천대학교 위도 경도: 37.3751° N, 126.6328° E
            center: new kakao.maps.LatLng(INU_LATITUDE, INU_LONGITUDE),
            level: 4,
            marker: markers
        };
        return new kakao.maps.Map(container, options)
    }

    const registerDragStartEvent = (map) => {
        const dragStart = function(mouseEvent) {
            console.log("drag start, " + mapObjects.length + ", " + renderIndex)
            removeAllMapObjects(map)
        }

        kakao.maps.event.addListener(map, 'dragstart', dragStart);
    }

    const removeAllMapObjects = (map) => {
        while(mapObjects.length > 0) {
            const obj = mapObjects.pop();

            if(obj instanceof kakao.maps.Circle) {
                obj.setMap(null);
            }

            if(obj instanceof kakao.maps.Polyline) {
                obj.setMap(null);
            }

            if(obj instanceof kakao.maps.CustomOverlay) {
                obj.setMap(null);
            }
        }
    }

    const registerDragEndEvent = (map) => {
        if(lastDragEndEvent != null)
            kakao.maps.event.removeListener(map, 'dragend', lastDragEndEvent)

        const dragEnd = function(mouseEvent) {
            console.log("drag end, " + mapObjects.length)

            renderMap(map)
        }

        kakao.maps.event.addListener(map, 'dragend', dragEnd);
        lastDragEndEvent = dragEnd
    }

    const onButtonClick = (index) => {
        setRenderIndex(index)
        console.log("render Type: " + index)
    }

    const onRouteNumberTextChanged = (event) => {
        setRouteNo(event.target.value)
    }

    useEffect(() => {
        // https://gist.github.com/allieus/1180051/ab33229e820a5eb60f8c7971b8d1f1fc8f2cfabb
        // https://fascinate-zsoo.tistory.com/29
        if(map == null) {
            proj4.defs('TM127', "+proj=tmerc +lat_0=38 +lon_0=127.0028902777777777776 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
            proj4.defs('TM128', "+proj=tmerc +lat_0=38 +lon_0=128E +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
            proj4.defs('GRS80', "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs")
            proj4.defs('EPSG:2097', "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
            proj4.defs('EPSG:4326', "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");

            map = createMap()

            registerDragStartEvent(map)
            console.log("init map")
        }

        registerDragEndEvent(map)
        removeAllMapObjects(map)
        renderMap(map)
        console.log("use effect")
    });

    return (
        <div className="root">
            <SelectBar onButtonClick={onButtonClick} onRouteNumberTextChanged={onRouteNumberTextChanged}/>
            <div id='map' style={{
                width: '100vw',
                height: '100vh'
            }}></div>
        </div>
    )
}

export default Main;