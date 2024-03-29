import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

// 홈 페이지 렌더링 컨트롤러
export const home = async (req, res) => {
    /**
    * callback 사용 예시
    Video.find({}, (error, videos) => {
        if (error) {
            return res.render("server-error")
        }
        // DB 검색 완료 후에 페이지 렌더링을 하기 위해 .find() 안에 추가
        return res.render("home", { pageTitle: "Home", videos: [] });
    });
     */
    // promise 사용 (비동기 처리하기)
    try {
        const videos = await Video.find({})
            .sort({ createdAt: "desc" })
            .populate("owner"); // 최신순으로 정렬
        return res.render("home", { pageTitle: "Home", videos: videos });
    } catch (error) {
        return res.render("server-error", { error });
    }
};

// 비디오 재생 페이지 렌더링 컨트롤러
export const watch = async (req, res) => {
    // ES6 문법 사용 (옆과 동알 -> const id = req.params.id;)
    const { id } = req.params;
    // 전달받은 Id로 video 조회 + owner 속성에 해당하는 데이터 연동(User모델 연동) + 댓글 데이터 연동(Comment모델)
    const video = await (
        await (await Video.findById(id)).populate("owner")
    ).populate({
        path: "comments",
        populate: {
            path: "owner",
            model: "User",
        },
    });

    // DB에 해당 데이터 없을 경우 에러처리
    if (!video) {
        return res
            .status(404)
            .render("404", { pageTitle: "Video not found.." });
    }
    return res.render("watch", { pageTitle: video.title, video: video });
};

// 비디오 정보 편집 페이지 렌더링 컨트롤러
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    // DB 조회
    const video = await Video.findById(id);
    // DB에 해당 데이터 없을 경우 에러처리
    if (!video) {
        return res
            .status(404)
            .render("404", { pageTitle: "Video not found.." });
    }
    // 해당 비디오 소유자가 아닐 경우 접근 불가 (비교 데이터 형식 주의)
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {
        pageTitle: `Edit: ${video.title}`,
        video: video,
    });
};

// 비디오 정보 수정 컨트롤러
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const { title, description, hashtags } = req.body;
    // DB 조회 (해당 id 데이터 존재 유무)
    const video = await Video.findById(id);

    // DB에 해당 데이터 없을 경우 에러처리
    if (!video) {
        return res
            .status(404)
            .render("404", { pageTitle: "Video not found.." });
    }
    // 해당 비디오 소유자가 아닐 경우 접근 불가 (비교 데이터 형식 주의)
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }

    // 변경사항 DB 업데이트 (해당 Id값 데이터 업데이트)
    await Video.findByIdAndUpdate(id, {
        title: title,
        description: description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved.");
    return res.redirect(`/videos/${id}`);
};

// 비디오 업로드 컨트롤러 (GET: 업로드 페이지 렌더링)
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

// 비디오 업로드 컨트롤러 (POST: DB 반영)
export const postUpload = async (req, res) => {
    // const {
    //     user: { _id },
    // } = req.session;
    // const { path: fileUrl } = req.file;
    // const { title, description, hashtags } = req.body;
    const {
        session: {
            user: { _id },
        },
        files: { video, thumb },
        body: { title, description, hashtags },
    } = req;
    const isHeroku = process.env.NODE_ENV === "production";
    // Video document 생성하기, mongo가 자동으로 고유한 랜덤 id값 부여함! (_id)
    // Video document DB 저장 (promise return을 위한 async/await)
    // DB 저장 방법 1) new, object, save 2) create
    try {
        const newVideo = await Video.create({
            title: title,
            // S3 저장소 위치가 담긴 file.location 사용 (로컬: file.path)
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? thumb[0].location : video[0].path,
            description: description,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};
// 비디오 삭제 컨트롤러 (GET)
export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    // DB에 해당 데이터 없을 경우 에러처리
    if (!video) {
        return res
            .status(404)
            .render("404", { pageTitle: "Video not found.." });
    }
    // 해당 비디오 소유자가 아닐 경우 접근 불가 (비교 데이터 형식 주의)
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    // DB 내 데이터 삭제
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

// 데이터 검색 컨트롤러 (GET: 검색 페이지 렌더링)
export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    // keyword 존재할 경우 해당 keyword로 DB 조회
    if (keyword) {
        // search
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search Video", videos });
};

/*
API Controller
*/
// 비디오 조회수 등록 컨트롤러 (API)
// 상태코드를 보내고 연결을 끝내기 위해 status => sendStatus 사용
export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

// 댓글 등록 컨트롤러 (API)
export const createComment = async (req, res) => {
    const {
        params: { id },
        body: { text },
        session: { user },
    } = req;

    // 비디오 조회
    const video = await Video.findById(id);
    // 비디오 존재 유무 검사
    if (!video) {
        return res.sendStatus(404);
    }
    // comment DB 등록
    const comment = await Comment.create({
        contents: text,
        owner: user._id,
        video: id,
    });
    // user 조회
    const commentUser = await User.findById(user._id);
    // user comments에 해당 댓글 id 추가
    commentUser.comments.push(comment._id);
    commentUser.save();
    // video comments에 해당 댓글 id 추가
    video.comments.push(comment._id);
    video.save();
    // 프론트엔드로 status code + 신규 댓글 id값 같이 리턴
    return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
    const {
        params: { id },
        session: {
            user: { _id },
        },
    } = req;
    // console.log(id, _id);

    // comment 조회
    const comment = await Comment.findById(id);
    console.log(comment);
    // comment 존재 유무 검사
    if (!comment) {
        req.flash("error", "Comment not found...");
        return res.sendStatus(404);
    }
    // user 조회
    const user = await User.findById(_id);
    // comment 소유자 검사
    if (String(comment.owner) !== String(user._id)) {
        req.flash("error", "You are not the owner of the comment.");
        return res.status(404).redirect("/");
    }
    // video 조회
    const video = await Video.findById(comment.video);

    // comment 삭제
    await Comment.findByIdAndDelete(id);
    // 해당 comment 데이터 다른 DB에서도 삭제
    user.comments.pull(id);
    video.comments.pull(id);
    user.save();
    video.save();
    // 삭제 성공 알림 및 리다이렉트
    // req.flash("info", "Successfully delete comment.");
    // return res.redirect(`/videos/${video._id}`);
    return res.sendStatus(200);
};
