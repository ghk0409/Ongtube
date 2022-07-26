const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// 전역변수
let stream;
let recorder;
let videoFile;

// 녹화 영상 다운로드 핸들러
const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
};

// 녹화 중지 핸들러
const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

// 카메라 녹화 핸들러
const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    // 미디어 녹화
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" }); // , { mimeType: "video/mp4" }
    recorder.ondataavailable = (event) => {
        // 브라우저 메모리에서만 가능한 URL 만들기
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        // 녹화된 영상 루프 재생
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};

// 카메라 초기화
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true, // { width: 200, height: 200 }
    });
    // src가 아닌 실시간 객체 전달을 위한 srcObject
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);
