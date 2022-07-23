const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currnetTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

// Global Variable
// 볼륨 설정
let volumeValue = 0.5;
video.volume = volumeValue;
// 마우스 감지 컨트롤
let controlsTimeout = null;
let controlsMovementTimeout = null;

// 재생버튼 핸들러
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

// 음소거버튼 핸들러
const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    // videoRange value가 0일 경우, 그 상태에서 음소거 풀었을 때 최소 볼륨으로 돌아가도록
    if (Number(volumeValue) === 0) {
        volumeValue = 0.1;
        video.volume = volumeValue;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

// 볼륨 조절 핸들러
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    // 볼륨 0으로 조정 시, 음소거버튼 활성화
    if (Number(value) === 0) {
        video.muted = true;
    } else {
        video.muted = false;
    }
    muteBtn.innerText = Number(value) === 0 ? "Unmute" : "Mute";
    volumeValue = value;
    video.volume = value;
};

// Time Formatting 함수
const formatTime = (seconds) => {
    const startIdx = seconds >= 3600 ? 11 : 14;
    return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

// 비디오 메타 데이터 핸들러
const handleLoadedMetaData = () => {
    // 비디오 총 재생 시간
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

// 비디오 재생 시간 핸들러
const handleTimeUpdate = () => {
    // 현재 재생 시간 업데이트
    currnetTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

// 비디오 타임라인 조정 핸들러
const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

// 전체화면 버튼 핸들러
const handleFullScreen = () => {
    const fullScreenCheck = document.fullscreenElement;
    // 전체화면 유무에 따라 버튼 텍스트 및 버튼 기능 구분
    if (fullScreenCheck) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
};

// 비디오 컨트롤창 숨김 함수
const hideControls = () => videoControls.classList.remove("showing");

// 비디오 위의 마우스 감지 핸들러
const handleMouseMove = () => {
    // setTimeout이 실행 중일 경우 취소 (마우스가 비디오 위를 떠났다가 다시 왔을 경우)
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    // 비디오 위에서 마우스가 계속 움직일 경우
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    // 비디오 위에서 마우스가 멈춰있을 경우 컨트롤창 숨김
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

// 비디오 위의 마우스 미감지 핸들러
const handleMouseLeave = () => {
    // 3초 이후에 showing 클래스 지우기
    controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
