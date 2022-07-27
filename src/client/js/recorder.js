import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// 전역변수
let stream;
let recorder;
let videoFile;

// 녹화 영상 다운로드 핸들러
const handleDownload = async () => {
    // ffmpeg로 녹화 영상 변환
    const ffmpeg = createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    });
    // 자바스크립트가 아닌 다른 소프트웨어를 가져오기 때문에 기다려야 함
    await ffmpeg.load();
    // ffmpeg 파일 생성
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    // ffmpeg 실행 명령어 (파일 포맷 변환 + 60프레임 저장)
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
    // 브라우저 가상 공간에 저장된 output.mp4 파일 가져오기
    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    // 가져온 mp4File의 buffer를 blob 데이터로 변환 (타입: mp4)
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    // 변환된 Blob 데이터를 object url로 변환
    const mp4Url = URL.createObjectURL(mp4Blob);
    // 변환된 object url을 다운로드
    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4";
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
