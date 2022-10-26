import React, {useEffect} from 'react'
import {getServerURL} from "./URLUtil";

const INU_LATITUDE = 37.3751
const INU_LONGITUDE = 126.6328

const { kakao, proj4 } = window;

function Main() {
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

    // const createMap = (markers) => {
    //     const staticMapContainer = document.getElementById('map');
    //     const staticMapOption = {
    //         // 인천대학교 위도 경도: 37.3751° N, 126.6328° E
    //         center: new kakao.maps.LatLng(INU_LATITUDE, INU_LONGITUDE),
    //         level: 4,
    //         marker: markers
    //     };
    //     return new kakao.maps.StaticMap(staticMapContainer, staticMapOption);
    // }

    const loadAllStations = (map) => {
        // fetch('http://localhost:8080/bus/station')
        fetch("http://localhost:8080/bus/station")
            .then((response) => response.json())
            .then((data) => {
                const markerPositions = []
                data.forEach(it => {
                    const result = proj4('TM127', 'WGS84', [it["posX"], it["posY"]]);
                    const latitude = result[1]
                    const longitude = result[0]

                    console.log(latitude, longitude)

                    const circle = new kakao.maps.Circle({
                        center : new kakao.maps.LatLng(latitude, longitude),  // 원의 중심좌표 입니다
                        radius: 20, // 미터 단위의 원의 반지름입니다
                        strokeWeight: 1, // 선의 두께입니다
                        strokeColor: '#75B8FA', // 선의 색깔입니다
                        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                        strokeStyle: 'dashed', // 선의 스타일 입니다
                        fillColor: '#CFE7FF', // 채우기 색깔입니다
                        fillOpacity: 0.7  // 채우기 불투명도 입니다
                    });

                    // 지도에 원을 표시합니다
                    circle.setMap(map);
                })
                console.log(data)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {

        // https://gist.github.com/allieus/1180051/ab33229e820a5eb60f8c7971b8d1f1fc8f2cfabb
        // https://fascinate-zsoo.tistory.com/29
        //
        proj4.defs('TM128', "+proj=tmerc +lat_0=38 +lon_0=128E +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
        proj4.defs('TM127', "+proj=tmerc +lat_0=38 +lon_0=127.0028902777777777776 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-146.43,507.89,681.46")
        proj4.defs('GRS80', "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs")
        proj4.defs('EPSG:2097', "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
        proj4.defs('EPSG:4326', "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");

        const map = createMap()
        loadAllStations(map)
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