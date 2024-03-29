import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

// 헤로쿠 배포일 경우 -> S3 / 로컬 서버일 경우 -> 로컬 저장
const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: "ongtube/images",
    acl: "public-read",
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: "ongtube/videos",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

// session 정보 또는 기본 정보를 res.locals에 저장하기 위한 미들웨어
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Ongtube";
    res.locals.loggedInUser = req.session.user || {};
    res.locals.isHeroku = isHeroku;
    next();
};

// 로그인 필요한 웹페이지 접근 보호 미들웨어
export const protectorMiddleware = (req, res, next) => {
    // 로그인 상태일 경우 요청을 계속함
    if (req.session.loggedIn) {
        return next();
        // 로그인 상태가 아닐 경우, 로그인 페이지로 리다이렉트
    } else {
        req.flash("error", "Login first.");
        return res.redirect("/login");
    }
};

// 이미 로그인된 유저가 로그인 미상태용 페이지로 접근을 막기 위한 미들웨어
export const publicOnlyMiddleware = (req, res, next) => {
    // 로그인 상태가 아닐 경우, 요청을 계속함
    if (!req.session.loggedIn) {
        return next();
        // 로그인 상태일 경우, 홈으로 리다이렉트
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
};

// 소셜 로그인 계정의 접근을 막기 위한 미들웨어
// export const passwordUsersOnlyMiddleware = (req, res, next) => {}

// avatar 업로드 관련 multer 미들웨어
export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000, // 약 3MB
    },
    storage: isHeroku ? s3ImageUploader : undefined,
});

// video 업로드 관련 multer 미들웨어
export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000, // 약 10MB
    },
    storage: isHeroku ? s3VideoUploader : undefined,
});
