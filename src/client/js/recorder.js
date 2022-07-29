import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

// 전역변수
let stream;
let recorder;
let videoFile;

// file명 오브젝트
const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

// 파일 다운로드 함수
const downloadFile = (fileUrl, filename) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
};

// 녹화 영상 다운로드 핸들러
const handleDownload = async () => {
    // 다운로드 반복 방지를 위해 이벤트 제거
    actionBtn.removeEventListener("click", handleDownload);
    // 버튼 텍스트 변경 및 사용 불가 상태 전환
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    // ffmpeg로 녹화 영상 변환 (transcoding)
    const ffmpeg = createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    });
    // 자바스크립트가 아닌 다른 소프트웨어를 가져오기 때문에 기다려야 함
    await ffmpeg.load();
    // ffmpeg 파일 생성
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    // ffmpeg 실행 명령어 (파일 포맷 변환 + 60프레임 저장)
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    // 썸네일 만들기 (영상의 1초 지점 이미지로 저장)
    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );
    // 브라우저 가상 공간에 저장된 output.mp4 / thumbnail.jpg 파일 가져오기
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    // 가져온 mp4File의 buffer를 blob 데이터로 변환 (타입: mp4)
    // 가져온 thumbFile의 buffer를 blob 데이터로 변환 (타입: jpg)
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    // 변환된 Blob 데이터를 object url로 변환
    // 변환된 Blob 데이터를 object url로 변환
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    // 변환된 object url들을 다운로드
    // 녹화 영상
    downloadFile(mp4Url, "MyRecording.mp4");
    // 썸네일
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    // ffmpeg 생성 파일 Unlink (속도 향상을 위함)
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    // object URL 객체 삭제 (메모리에서 제거)
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // 기능 종료 후 버튼 활성화 (처음 기능으로 초기화)
    actionBtn.innerText = "Record Again";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleStart);
};

// 녹화 중지 핸들러
// const handleStop = () => {
//     actionBtn.innerText = "Download Recording";
//     actionBtn.removeEventListener("click", handleStop);
//     actionBtn.addEventListener("click", handleDownload);

//     recorder.stop();
// };

// 카메라 녹화 핸들러 (5초간 녹화)
const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);

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
        // 녹화 완료 후 버튼 기능 전환
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    };
    recorder.start();
    // 5초간 녹화 후 종료
    setTimeout(() => {
        recorder.stop();
    }, 5000);
};

// 카메라 초기화
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: 1024,
            height: 576,
        }, // { width: 200, height: 200 }
    });
    // src가 아닌 실시간 객체 전달을 위한 srcObject
    video.srcObject = stream;
    video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
