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
        const videos = await Video.find({});
        return res.render("home", { pageTitle: "Home", videos: videos });
    } catch (error) {
        return res.render("server-error", { error });
    }
};

// 비디오 재생 페이지 렌더링 컨트롤러
export const watch = (req, res) => {
    // ES6 문법 사용 (옆과 동알 -> const id = req.params.id;)
    const { id } = req.params;
    return res.render("watch", { pageTitle: `Watching` });
};

// 비디오 정보 편집 페이지 렌더링 컨트롤러
export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", { pageTitle: `Editing` });
};

// 비디오 정보 수정 컨트롤러
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};

// 비디오 업로드 컨트롤러
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    // Video document 생성하기, mongo가 자동으로 고유한 랜덤 id값 부여함! (_id)
    // Video document DB 저장 (promise return을 위한 async/await)
    // DB 저장 방법 1) new, object, save 2) create
    try {
        await Video.create({
            title: title,
            description: description,
            hashtags: hashtags.split(",").map((word) => `#${word}`),
        });
        return res.redirect("/");
    } catch (error) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};
