
let lastUpdate = -1
const { kakao, proj4 } = window;

async function render(map, mapObjects, rangeX, rangeY, fontSize) {
    const domain = "http://localhost:8080"
    const center = map.getCenter();
    const lng = center.getLng();
    const lat = center.getLat();
    // const rangeX = 0.1
    // const rangeY = 0.05

    const currentUpdate = Date.now()
    lastUpdate = currentUpdate

    const stations = await (await fetch(`${domain}/bus/station?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()
    // const usages = await (await fetch(`${domain}/bus/path?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()
    // const usages = await (await fetch(`${domain}/bus/pathspec?routeNo=58`)).json()
    const throughs = await (await fetch(`${domain}/bus/through?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()
    const traffics = await (await fetch(`${domain}/bus/traffic?x=${lng}&y=${lat}&rangeX=${rangeX}&rangeY=${rangeY}`)).json()

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

            const list = []
            let currentSequence = first["busStopSequence"]

            while (index < throughs.length) {
                const middle = throughs[index]

                if (first["routeId"] === middle["routeId"] && currentSequence === middle["busStopSequence"]) {
                    // console.log(index + ", " + first + ", " + middle["routeId"])
                    const middleResult = proj4('TM127', 'WGS84', [middle["posX"], middle["posY"]])
                    list.push(new kakao.maps.LatLng(middleResult[1], middleResult[0]));
                    index++;
                } else {
                    break;
                }

                currentSequence++;
            }

            // console.log(list.length + ", " + index)

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
        }

        // traffics
        const shortIdToStationMap = new Map();
        const shortIdToSize = new Map();
        // map1.set('a', 1);
        // map1.set('b', 2);
        // map1.set('c', 3);
        //
        // console.log(map1.get('a'));
        stations.forEach(it => {
            shortIdToStationMap.set(it["shortId"], it)
        })

        // console.log(shortIdToStationMap)

        traffics.forEach(it => {
            // console.log(it)
            const shortId = it["shortId"]
            const total = it["time00On"] + it["time01On"] + it["time02On"] + it["time03On"] + it["time04On"] + it["time05On"] +
                it["time06On"] + it["time07On"] + it["time08On"] + it["time09On"] + it["time10On"] + it["time11On"] +
                it["time12On"] + it["time13On"] + it["time14On"] + it["time15On"] + it["time16On"] + it["time17On"] +
                it["time18On"] + it["time19On"] + it["time20On"] + it["time21On"] + it["time22On"] + it["time23On"] +
                it["time00Off"] + it["time01Off"] + it["time02Off"] + it["time03Off"] + it["time04Off"] + it["time05Off"] +
                it["time06Off"] + it["time07Off"] + it["time08Off"] + it["time09Off"] + it["time10Off"] + it["time11Off"] +
                it["time12Off"] + it["time13Off"] + it["time14Off"] + it["time15Off"] + it["time16Off"] + it["time17Off"] +
                it["time18Off"] + it["time19Off"] + it["time20Off"] + it["time21Off"] + it["time22Off"] + it["time23Off"];

            if(shortIdToSize.has(shortId)) {
                shortIdToSize.set(shortId, shortIdToSize.get(shortId) + total)
            } else {
                shortIdToSize.set(shortId, total)
            }
        })

        // console.log("shortIdToSize: " + shortIdToSize)

        for(const shortId of shortIdToSize.keys()) {
            // console.log(shortId)
            const size = shortIdToSize.get(shortId)
            const station = shortIdToStationMap.get(shortId)

            if(station !== undefined) {
                // console.log("station: " + station)


                const result = proj4('TM127', 'WGS84', [station["posX"], station["posY"]]);
                const latitude = result[1]
                const longitude = result[0]
                const latLng = new kakao.maps.LatLng(latitude, longitude);

                let total = ""

                // 자리수 구하기
                let temp = size
                let digit = 0

                while(temp > 0) {
                    let oneDigit = temp % 10
                    temp = Math.floor(temp / 10)

                    total += oneDigit.toString()
                    digit++

                    if(digit % 3 === 0 && temp > 0) {
                        total += ","
                    }
                }

                function reverseString(str) {
                    // Step 1. Use the split() method to return a new array
                    const splitString = str.split(""); // var splitString = "hello".split("");
                    // ["h", "e", "l", "l", "o"]

                    // Step 2. Use the reverse() method to reverse the new created array
                    const reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
                    // ["o", "l", "l", "e", "h"]

                    // Step 3. Use the join() method to join all elements of the array into a string
                    const joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
                    // "olleh"

                    //Step 4. Return the reversed string
                    return joinArray; // "olleh"
                }

                // 11,111,111,111

                const content = `<div style="font-size: ${fontSize}pt">${reverseString(total)}</div>`;

                const customOverlay = new kakao.maps.CustomOverlay({
                    position: latLng,
                    content: content
                });

                customOverlay.setMap(map);
                mapObjects.push(customOverlay);
            }
        }
    } // end of lastTime === currentTime
}

export default render