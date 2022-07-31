const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

// 댓글 생성 함수 (HTML Element 생성)
const addComment = (text, newCommentId) => {
    // 댓글 생성에 필요한 html element 생성하기
    const videoComments = document.querySelector(".video__comments ul");
    // li 만들기 (해당 댓글 ID값 부여)
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.commentId = `${newCommentId}`;
    // icon 만들기
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    // span 만들기
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    // span X 만들기
    const spanX = document.createElement("span");
    spanX.innerText = "❌";

    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(spanX);
    // 신규 댓글을 가장 위에 추가하기 위해 prepend()
    videoComments.prepend(newComment);
};

// 댓글 등록 핸들러
const handleSubmit = async (event) => {
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
    // 댓글 등록 API 호출 (reload를 위해 async/await 사용)
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        // 서버에 json 형식으로 보냄을 알리기 위한 header 추가
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
    });

    if (response.status === 201) {
        // response의 newCommentId 값 가져오기 (body 안에 숨겨져 있어서 json 파싱 후 가져옴)
        const { newCommentId } = await response.json();
        // 새로고침 없이 실시간으로 보이게끔 댓글 생성
        addComment(text, newCommentId);
        textarea.value = "";
    }
};

// form이 있을 경우에만 이벤트리스너 추가
if (form) {
    form.addEventListener("submit", handleSubmit);
}
