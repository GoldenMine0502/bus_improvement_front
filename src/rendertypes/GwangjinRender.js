const {kakao, proj4} = window;

async function GwangjinRender(map, mapObjects, type) {
    const domain = "http://localhost:8090"

    const stations = await (await fetch(`${domain}/gwangjin/calculate/stations`)).json() // List<BusStopStation>
    const indices = await (await fetch(`${domain}/gwangjin/calculate/getindices?type=${type}`)).json() // List<BusStopStation>
    const paths = await (await fetch(`${domain}/gwangjin/calculate/getallroutes?type=${type}`)).json() // List<BusStopStation>

    console.log(stations)
    console.log(indices)
    console.log(paths)

    for(const routeId in paths["path"]) {
        const routes = paths["path"][routeId]
        const list = []
        console.log(routeId)
        console.log(routes)

        for (let index = 0; index < routes.length; index++) {
            let start = stations[indices[routes[index]]]

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
}

export default GwangjinRender;