const {kakao, proj4} = window;

async function specificAllRender(map, mapObjects, url) {
    const domain = "http://localhost:8080"

    const stations = await (await fetch(`${domain}/bus/allstation`)).json() // List<BusStopStation>
    const paths = await (await fetch(`${domain}/calculate/${url}`)).json() // List<BusStopStation>
    console.log(paths)

    for(const routeId in paths) {
        const routes = paths[routeId]
        const list = []

        for (let index = 0; index < routes.length; index++) {
            let start = stations[routes[index]]

            const result = proj4('TM127', 'WGS84', [start["posX"], start["posY"]]);
            const latitude = result[1]
            const longitude = result[0]

            const latLng = new kakao.maps.LatLng(latitude, longitude)

            list.push(latLng)
        }

        const polyline = new kakao.maps.Polyline({
            path: list, // 선을 구성하는 좌표배열 입니다
            strokeWeight: 5, // 선의 두께 입니다
            strokeColor: '#000000', // 선의 색깔입니다
            strokeOpacity: 0.4, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
        });

        mapObjects.push(polyline);
        polyline.setMap(map);
    }


    // paths.forEach(function (value, key, map) {
    //     console.log(`m[${key}] = ${value}`);
    //     console.log(value.length)
    //
    //     const list = []
    //
    //     for (let index = 0; index < value.length; index++) {
    //         let start = stations[value[index]]
    //         console.log(index)
    //         console.log(start)
    //
    //         const result = proj4('TM127', 'WGS84', [start["posX"], start["posY"]]);
    //         const latitude = result[1]
    //         const longitude = result[0]
    //
    //         const latLng = new kakao.maps.LatLng(latitude, longitude)
    //         console.log(latLng)
    //         list.push(latLng)
    //     }
    //
    //     const polyline = new kakao.maps.Polyline({
    //         path: list, // 선을 구성하는 좌표배열 입니다
    //         strokeWeight: 10, // 선의 두께 입니다
    //         strokeColor: '#FFAE00', // 선의 색깔입니다
    //         strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    //         strokeStyle: 'solid' // 선의 스타일입니다
    //     });
    //
    //     mapObjects.push(polyline);
    //     polyline.setMap(map);
    // })

    // for (const routeId of paths.keys()) {
    //     const indices = JSON.parse(paths[routeId])
    //
    //     console.log(routeId)
    //     console.log(indices)
    //     console.log(indices[0])
    //
    //     const list = indices
    //         .map(it => stations[it])
    //         .map(it => {
    //             const result = proj4('TM127', 'WGS84', [it["posX"], it["posY"]]);
    //             const latitude = result[1]
    //             const longitude = result[0]
    //
    //             const latLng = new kakao.maps.LatLng(latitude, longitude)
    //
    //             return latLng
    //         }).toArray()
    //
    //     // 지금 리스트는 해당 sequence에 대한 연결 정보를 담고 있다.
    //     const polyline = new kakao.maps.Polyline({
    //         path: list, // 선을 구성하는 좌표배열 입니다
    //         strokeWeight: 5, // 선의 두께 입니다
    //         strokeColor: '#FFAE00', // 선의 색깔입니다
    //         strokeOpacity: 0.3, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    //         strokeStyle: 'solid' // 선의 스타일입니다
    //     });
    //
    //     mapObjects.push(polyline);
    //     polyline.setMap(map);
    // }
}

export default specificAllRender;