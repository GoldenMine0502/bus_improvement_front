import React, {useEffect, useState} from 'react'
import {getServerURL} from "./URLUtil";
import poly from "proj4/lib/projections/poly";
import SelectBar from "./SelectBar";
import "./Main.css"
import AllRender from "./rendertypes/AllRender";
import SpecificRender from "./rendertypes/SpecificRender";
import SpecificAllRender from "./rendertypes/SpecificAllRender";

const INU_LATITUDE = 37.3751;
const INU_LONGITUDE = 126.6328;

const { kakao, proj4 } = window;

let map = null;
const mapObjects = [];
let lastDragEndEvent = null;

function Main() {
    const [renderType, setRenderType] = useState("all")
    const [routeNo, setRouteNo] = useState("")

    const renderMap = async () => {
        removeAllMapObjects()
        switch (renderType) {
            case "all":
            default:
                AllRender(map, mapObjects, 0.025, 0.015, 12)
                break;
            case "allbig":
                AllRender(map, mapObjects, 0.1, 0.04, 5)
                break;
            case "dijkstra":
                SpecificRender(map, mapObjects, "dijkstraroute", routeNo)
                break;
            case "dijkstragreedy5":
                SpecificRender(map, mapObjects, "dijkstragreedy5route", routeNo)
                break;
            case "dijkstragreedy25":
                SpecificRender(map, mapObjects, "dijkstragreedy25route", routeNo)
                break;
            case "shortest":
                SpecificRender(map, mapObjects, "shortestroute", routeNo)
                break;
            case "original":
                SpecificRender(map, mapObjects, "originalroute", routeNo)
                break;
            case "shortestall":
                SpecificAllRender(map, mapObjects, "allshortestroute")
                break;
            case "dijkstraall":
                SpecificAllRender(map, mapObjects, "alldijkstraroute")
                break;
            case "dijkstragreedyall5":
                SpecificAllRender(map, mapObjects, "alldijkstragreedy5route")
                break;
            case "dijkstragreedyall25":
                SpecificAllRender(map, mapObjects, "alldijkstragreedy25route")
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

    const registerDragStartEvent = () => {
        const dragStart = function(mouseEvent) {
            console.log("drag start, " + mapObjects.length + ", " + renderType)
            removeAllMapObjects(map)
        }

        kakao.maps.event.addListener(map, 'dragstart', dragStart);
    }

    const removeAllMapObjects = () => {
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

    const registerDragEndEvent = () => {
        if(lastDragEndEvent != null)
            kakao.maps.event.removeListener(map, 'dragend', lastDragEndEvent)

        const dragEnd = function(mouseEvent) {
            console.log("drag end, " + mapObjects.length)

            renderMap(map)
        }

        kakao.maps.event.addListener(map, 'dragend', dragEnd);
        lastDragEndEvent = dragEnd
    }

    const onButtonClick = (type) => {
        setRenderType(type)
        console.log("render Type: " + type)
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

            registerDragStartEvent()
            console.log("init map")
        }

        registerDragEndEvent()
        renderMap()
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