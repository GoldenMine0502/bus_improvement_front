import React, {useEffect, useState} from 'react'
import {getServerURL} from "./URLUtil";
import poly from "proj4/lib/projections/poly";

const INU_LATITUDE = 37.3751
const INU_LONGITUDE = 126.6328

const { kakao, proj4 } = window;

function Main() {
    const mapObjects = []
    let lastUpdate = -1

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
        kakao.maps.event.addListener(map, 'dragstart', function(mouseEvent) {
            console.log("drag start, " + mapObjects.length)
            removeAllMapObjects(map)
        });
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
        }
    }

    const registerDragEndEvent = (map) => {
        kakao.maps.event.addListener(map, 'dragend', function(mouseEvent) {
            console.log("drag end, " + mapObjects.length)

            loadAllStations(map)
        });
    }

    const loadAllStations = async (map) => {
        const domain = "http://localhost:8080"
        const center = map.getCenter();
        const lng = center.getLng();
        const lat = center.getLat();
        const rangeX = 0.03
        const rangeY = 0.02

        const currentUpdate = Date.now()
        lastUpdate = currentUpdate

        const stations = await (await fetch(`${domain}/bus/station?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()
        // const usages = await (await fetch(`${domain}/bus/path?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()
        // const usages = await (await fetch(`${domain}/bus/pathspec?routeNo=58`)).json()
        const throughs = await (await fetch(`${domain}/bus/through?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()

        if(lastUpdate === currentUpdate) {
            stations.forEach(it => {
                const result = proj4('TM127', 'WGS84', [it["posX"], it["posY"]]);
                const latitude = result[1]
                const longitude = result[0]

                // console.log(latitude, longitude)

                const circle = new kakao.maps.Circle({
                    center: new kakao.maps.LatLng(latitude, longitude),  // 원의 중심좌표 입니다
                    radius: 25, // 미터 단위의 원의 반지름입니다
                    strokeWeight: 1, // 선의 두께입니다
                    strokeColor: '#75B8FA', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'dashed', // 선의 스타일 입니다
                    fillColor: '#CFE7FF', // 채우기 색깔입니다
                    fillOpacity: 0.95  // 채우기 불투명도 입니다
                });

                mapObjects.push(circle)
                // 지도에 원을 표시합니다
                circle.setMap(map);
            })

            // usages
            // console.log(usages)
            // console.log(usages.length)
            // let index = 0;
            //
            // while (index < usages.length) {
            //     const first = usages[index]
            //     // const firstResult = proj4('TM127', 'WGS84', [first["posX"], first["posY"]]);
            //
            //     const list = []
            //     let currentSequence = first["sequence"]
            //
            //     while (index < usages.length) {
            //         const middle = usages[index]
            //
            //         if (first["fromId"] === middle["fromId"] && currentSequence === middle["sequence"]) {
            //             // console.log(index + ", " + first + ", " + middle["routeId"])
            //             // const middleResult = proj4('TM127', 'WGS84', [middle["posX"], middle["posY"]])
            //             // list.push(new kakao.maps.LatLng(middleResult[1], middleResult[0]));
            //             list.push(new kakao.maps.LatLng(middle["posY"], middle["posX"]))
            //             index++;
            //         } else {
            //             break;
            //         }
            //
            //         if(first["sequence"] !== middle["sequence"])
            //             currentSequence++;
            //     }
            //
            //     // console.log(list.length + ", " + index)
            //
            //     // 지금 리스트는 해당 sequence에 대한 연결 정보를 담고 있다.
            //     const polyline = new kakao.maps.Polyline({
            //         path: list, // 선을 구성하는 좌표배열 입니다
            //         strokeWeight: 5, // 선의 두께 입니다
            //         // strokeColor: '#FFAE00', // 선의 색깔입니다
            //         strokeColor: `#000000`,
            //         // strokeOpacity: 0.3, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            //         strokeOpacity: 0.9,
            //         strokeStyle: 'solid' // 선의 스타일입니다
            //     });
            //
            //     mapObjects.push(polyline);
            //     polyline.setMap(map);
            //
            //     // index++;
            // }

            // throughs
            console.log(throughs)
            console.log(throughs.length)
            let index = 0;

            while (index < throughs.length) {
                const first = throughs[index]
                const firstResult = proj4('TM127', 'WGS84', [first["posX"], first["posY"]]);

                const list = []
                let currentSequence = first["busStopSequence"]

                while (index < throughs.length) {
                    const middle = throughs[index]

                    if (first["routeId"] === middle["routeId"] && currentSequence === middle["busStopSequence"]) {
                        console.log(index + ", " + first + ", " + middle["routeId"])
                        const middleResult = proj4('TM127', 'WGS84', [middle["posX"], middle["posY"]])
                        list.push(new kakao.maps.LatLng(middleResult[1], middleResult[0]));
                        index++;
                    } else {
                        break;
                    }

                    currentSequence++;
                }

                console.log(list.length + ", " + index)

                // 지금 리스트는 해당 sequence에 대한 연결 정보를 담고 있다.
                const polyline = new kakao.maps.Polyline({
                    path: list, // 선을 구성하는 좌표배열 입니다
                    strokeWeight: 5, // 선의 두께 입니다
                    strokeColor: '#FFAE00', // 선의 색깔입니다
                    strokeOpacity: 0.3, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'solid' // 선의 스타일입니다
                });

                mapObjects.push(polyline);
                polyline.setMap(map);

                // index++;
            }
        }
    }

    useEffect(() => {
        // https://gist.github.com/allieus/1180051/ab33229e820a5eb60f8c7971b8d1f1fc8f2cfabb
        // https://fascinate-zsoo.tistory.com/29
        proj4.defs('TM127', "+proj=tmerc +lat_0=38 +lon_0=127.0028902777777777776 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
        proj4.defs('TM128', "+proj=tmerc +lat_0=38 +lon_0=128E +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
        proj4.defs('GRS80', "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs")
        proj4.defs('EPSG:2097', "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
        proj4.defs('EPSG:4326', "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");

        const map = createMap()
        loadAllStations(map)
        registerDragStartEvent(map)
        registerDragEndEvent(map)
        // loadAllStations()
    });

    return (
        <div id='map' style={{
            width: '100vw',
            height: '100vh'
        }}></div>
    )
}

export default Main;