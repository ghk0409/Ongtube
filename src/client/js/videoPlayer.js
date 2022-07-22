const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

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

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
