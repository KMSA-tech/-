// 지정된 장소의 위도와 경도 (예: 서울 논현동 좌표)
const targetLatitude = 37.511805;  // 목적지 위도
const targetLongitude = 127.034702;  // 목적지 경도
const allowedRadius = 20; // 허용 반경 20미터

// 버튼과 메시지 영역 선택
const checkLocationButton = document.getElementById('checkLocation');
const message = document.getElementById('message');

// 버튼 클릭 이벤트
checkLocationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    // 위치 정보를 가져옵니다.
    navigator.geolocation.getCurrentPosition(success, error);
    message.textContent = "위치 정보를 확인하는 중입니다...";
  } else {
    message.textContent = "이 브라우저에서는 위치 정보 기능을 지원하지 않습니다.";
  }
});

// 위치 정보가 성공적으로 가져와졌을 때 실행될 함수
function success(position) {
  const latitude = position.coords.latitude;  // 현재 위치의 위도
  const longitude = position.coords.longitude;  // 현재 위치의 경도

  // 사용자의 현재 위치와 목표 위치 사이의 거리 계산
  const distance = getDistanceFromLatLonInMeters(latitude, longitude, targetLatitude, targetLongitude);

  // 거리가 허용된 반경 내에 있을 경우
  if (distance <= allowedRadius) {
    message.textContent = "위치 확인 완료. 설문조사 페이지로 이동합니다.";

    // 서버로 토큰을 요청하여 구글 폼 URL로 리다이렉트
    fetch('http://localhost:3000/generate-token')
      .then(response => response.json())
      .then(data => {
        // 서버에서 받은 URL로 리다이렉트 (토큰 포함된 구글 폼 링크)
        window.location.href = data.url;
      });
  } else {
    // 허용 반경 밖에 있을 경우 메시지 표시
    message.textContent = "지정된 위치 내에서만 설문조사에 참여할 수 있습니다.";
  }
}

// 위치 정보를 가져오지 못한 경우 실행될 함수
function error() {
  message.textContent = "위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인하세요.";
}

// 두 좌표 간의 거리를 계산하는 함수 (하버사인 공식을 사용)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const R = 6371000;  // 지구 반지름 (미터 단위)
  const dLat = deg2rad(lat2 - lat1);  // 위도 차이
  const dLon = deg2rad(lon2 - lon1);  // 경도 차이
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;  // 두 좌표 사이의 거리 (미터 단위)
  return d;
}
