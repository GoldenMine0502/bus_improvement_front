const {kakao, proj4} = window;

async function specificRender(map, mapObjects, url, routeNo) {
    const domain = "http://localhost:8080"
    // const routeId = "161000007"

    const routeId = (await (await fetch(`${domain}/bus/idfromno?routeNo=${routeNo}`)).json())["routeId"]
    const stations = await (await fetch(`${domain}/bus/allstation`)).json() // List<BusStopStation>
    const routes = await (await fetch(`${domain}/calculate/${url}?routeNo=${routeId}`)).json() // List<Int>

    console.log(stations)
    console.log(routes)

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
        strokeWeight: 10, // 선의 두께 입니다
        strokeColor: '#FFAE00', // 선의 색깔입니다
        strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });

    mapObjects.push(polyline);
    polyline.setMap(map);
}

export default specificRender;