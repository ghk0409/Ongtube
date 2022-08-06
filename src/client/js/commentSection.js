const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".video__comment-deleteBtn");

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
    const aDelete = document.createElement("span");
    // aDelete.href = `/api/comment/${newCommentId}/delete`;
    aDelete.dataset.commentId = `${newCommentId}`;
    aDelete.innerText = "❌";

    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(aDelete);
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

// 댓글 삭제 핸들러
const handleDeleteComment = async (event) => {
    const videoComments = document.querySelector(".video__comments ul");
    const commentId = event.target.dataset.commentId;
    // 댓글 삭제 API 호출
    const response = await fetch(`/api/comment/${commentId}/delete`, {
        method: "GET",
    });

    if (response.status === 200) {
        // 삭제 성공 시, 해당 댓글 실시간으로 새로고침없이 삭제되게끔 처리
        const deletedComment = videoComments.querySelector(
            `.video__comment[data-comment-id="${commentId}"]`
        );
        deletedComment.remove();
    }
};

// form이 있을 경우에만 이벤트리스너 추가
if (form) {
    form.addEventListener("submit", handleSubmit);
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", handleDeleteComment);
        // btn.parentNode.removeChild(btn)
    });
}
