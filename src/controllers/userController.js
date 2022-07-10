import User from "../models/User";
import bcrypt from "bcrypt";

// 회원가입 GET 컨트롤러 (회원가입 페이지 렌더링)
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
// 회원가입 POST 컨트롤러 (유저 생성)
export const postJoin = async (req, res) => {
    const { name, email, username, password, passwordCheck, location } =
        req.body;
    const pageTitle = "Join";

    // password와 passwordCheck 동일 비교
    if (password !== passwordCheck) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }

    // username \ email 중복검사
    const exists = await User.exists({
        $or: [{ username }, { email }],
    });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }

    try {
        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};

// 로그인 GET 컨트롤러 (로그인 페이지 렌더링)
export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Login" });

// 로그인 POST 컨트롤러 (유저 로그인))
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    // check if account exists
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    }
    // check if password correct (해싱된 패스워드와 비교!)
    const loginOk = await bcrypt.compare(password, user.password);
    if (!loginOk) {
        return res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "Wrong Password!!",
        });
    }
    console.log("Login Success!!");
    return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit users");

export const remove = (req, res) => res.send("remove user!");

export const logout = (req, res) => res.send("Logout!!");

export const see = (req, res) => res.send("See User!");
