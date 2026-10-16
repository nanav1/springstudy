import { useEffect, useRef } from "react"

const {kakao} = window
function KakaoMap() {
    const mapRef = useRef(null);
    useEffect(()=>{
        kakaoMapStart();
        newposi();
    },[])
    function kakaoMapStart(){
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = { 
                center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        mapRef.current = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        // 지도에 교통정보를 표시하도록 지도타입을 추가합니다
        mapRef.current.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);    
} 

    function newposi(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    console.log(position)
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const newPosition = new kakao.maps.LatLng(lat,lon);
                    displayMarker(newPosition);
                })
        }
    }
    function displayMarker(newPosition){
        const marker = new kakao.maps.Marker({  
            map: mapRef.current, 
            position: newPosition
        }); 
        mapRef.current.setCenter(newPosition);  
    }

  return (
    <div style={{width:"100%", minHeight:"90vh", background:"pink"}}>
        <div id="map" style={{ width: "100%", height: "90vh" }}></div>
    </div>
  )
}

export default KakaoMap