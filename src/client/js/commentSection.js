const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

// 댓글 등록 핸들러
const handleSubmit = (event) => {
    // submit 새로고침 방지
    event.preventDefault();
    // 댓글에 필요한  데이터 초기화
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const { videoId } = videoContainer.dataset;

    // textarea 비어있을 경우 반응 X
    if (text === "") {
        return;
    }
    // 댓글 등록 API 호출
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        // 서버에 json 형식으로 보냄을 알리기 위한 header 추가
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
    });
};

// form이 있을 경우에만 이벤트리스너 추가
if (form) {
    form.addEventListener("submit", handleSubmit);
}
