const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currnetTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
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
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
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
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
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
    muteBtnIcon.classList =
        Number(value) === 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
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
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
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
    // 비디오 위에서 마우스가 멈춰있을 경우 컨트롤창 숨김 (clearTimeout 사용을 위해 setTimeout ID값 저장)
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

// 비디오 위의 마우스 미감지 핸들러
const handleMouseLeave = () => {
    // 3초 이후에 showing 클래스 지우기 (clearTimeout 사용을 위해 setTimeout ID값 저장)
    controlsTimeout = setTimeout(hideControls, 3000);
};

// 키보드 비디오 볼륨 조절 함수
const handleVolumeKey = (key) => {
    if (key === "ArrowUp" && video.volume < 0.95) {
        video.volume += 0.05;
    } else if (key === "ArrowDown" && video.volume > 0.05) {
        video.volume -= 0.05;
    }
    volumeValue = video.volume;
    volumeRange.value = volumeValue;
};

// 키보드 비디오 재생 조절 함수
const handleVideoMoveKey = (key) => {
    // 5초 단위로 이동
    if (key === "ArrowLeft") {
        // 5초 미만이 재생됐을 경우 비디오 재생 처음으로 (0초)
        video.currentTime = video.currentTime > 5 ? video.currentTime - 5 : 0;
    } else if (key === "ArrowRight") {
        // 남은 재생시간이 5초 미만일 경우 비디오 재생 마지막으로 (video.duration)
        video.currentTime =
            video.currentTime < video.duration - 5
                ? video.currentTime + 5
                : video.duration;
    }
};

// 키보드 단축키 기능 핸들러
const handleKeydown = (event) => {
    // 댓글 입력창에서 키보드 단축키 방지 (textarea id = commentArea 지정)
    if (event.target.id !== "commentArea") {
        const k = event.key;
        // if (k === " ") {
        //     event.preventDefault();
        //     handlePlayClick();
        // }
        switch (k) {
            // 유튜브처럼 스페이스 누르면 아래로 화면 이동없이 영상 재생/정지만
            case " ":
                event.preventDefault();
                handlePlayClick();
                break;
            // m/M/ㅡ 누를 경우 음소거 기능
            case "m":
            case "M":
            case "ㅡ":
                handleMuteClick();
                break;
            // f/F/ㄹ 누를 경우 전체화면 기능
            case "f":
            case "F":
            case "ㄹ":
                handleFullScreen();
                break;
            // 방향키 ↑ 볼륨 업 / ↓ 볼륨 다운
            case "ArrowUp":
            case "ArrowDown":
                handleVolumeKey(k);
                break;
            // 방향키 ← 5초 이전 / → 5초 이후
            case "ArrowLeft":
            case "ArrowRight":
                handleVideoMoveKey(k);
                break;
        }
    }
};

// Register View API
const handleEnded = () => {
    const { videoId } = videoContainer.dataset;
    fetch(`/api/videos/${videoId}/view`, {
        method: "POST",
    });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("click", handlePlayClick); // 비디오 화면 클릭 시 재생/정지
video.addEventListener("canplay", handleLoadedMetaData);
handleLoadedMetaData();
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded); // 비디오 조회수 등록 API
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handleKeydown); // 키보드 눌렀을 때 단축키 작동
