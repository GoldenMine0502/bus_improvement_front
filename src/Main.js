import React, { useState, useEffect } from 'react'

const { kakao } = window;

function Main() {
    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            // 인천대학교 위도 경도: 37.3751° N, 126.6328° E
            center: new kakao.maps.LatLng(37.3751, 126.6328),
            level: 4
        };
        const map = new kakao.maps.Map(container, options);
    });

    return (
        <div id='map' style={{
            width: '100vw',
            height: '100vh'
        }}></div>
    )
}

export default Main;