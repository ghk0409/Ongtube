import User from "../models/User";
import Video from "../models/Video";

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
        const videos = await Video.find({}).sort({ createdAt: "desc" }); // 최신순으로 정렬
        return res.render("home", { pageTitle: "Home", videos: videos });
    } catch (error) {
        return res.render("server-error", { error });
    }
};

// 비디오 재생 페이지 렌더링 컨트롤러
export const watch = async (req, res) => {
    // ES6 문법 사용 (옆과 동알 -> const id = req.params.id;)
    const { id } = req.params;
    // 전달받은 Id로 video 조회 + owner 속성에 해당하는 데이터 연동(User모델 연동)
    const video = await (await Video.findById(id)).populate("owner");
    console.log(video);
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
    const video = await Video.exists({ _id: id });

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
        file: { path: fileUrl },
        body: { title, description, hashtags },
    } = req;
    // Video document 생성하기, mongo가 자동으로 고유한 랜덤 id값 부여함! (_id)
    // Video document DB 저장 (promise return을 위한 async/await)
    // DB 저장 방법 1) new, object, save 2) create
    try {
        const newVideo = await Video.create({
            title: title,
            fileUrl: fileUrl,
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
        });
    }
    return res.render("search", { pageTitle: "Search Video", videos });
};
