import User from "../models/User";
import fetch from "cross-fetch";
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
    const user = await User.findOne({ username, socialOnly: false });
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
    // session에 유저 정보 추가
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

// Github OAuth 앱 로그인 연동 컨트롤러
export const startGithubLogin = (req, res) => {
    // github login base url
    const baseUrl = "https://github.com/login/oauth/authorize";
    // url params
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    // final url
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl);
};

// Github 앱 인증 연동 컨트롤러
export const finishGithubLogin = async (req, res) => {
    // github access_token base url
    const baseUrl = "https://github.com/login/oauth/access_token";
    // url params
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    // final url
    const finalUrl = `${baseUrl}?${params}`;
    // access_token 요청
    // POST 요청 시, headers 안 넣으면 text로 return됨
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json,",
            },
        })
    ).json();
    // access_token 값으로 github API 호출 -> 필요 데이터 요청
    if ("access_token" in tokenRequest) {
        // access api 호출
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        // user api 호출
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // user email api 호출
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // emailData에서 인증된 고유한 이메일 값만 가져오기
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        // 고유+인증된 이메일 없을 경우 로그인 페이지 리다이렉트
        if (!emailObj) {
            // set notification
            return res.redirect("/login");
        }
        // DB에 해당 email 가진 유저가 있는지 확인
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            // create an account (계정 생성)
            // 해당 계정은 password가 없으므로 로그인 form 이용 불가
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                email: emailObj.email,
                username: userData.login,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        // session에 유저 정보 추가
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

// 로그아웃 컨트롤러
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

// 유저 프로파일 GET 컨트롤러 (프로파일 수정 페이지 렌더링)
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

// 유저 프로파일 POST 컨트롤러 (프로파일 수정)
export const postEdit = async (req, res) => {
    // ES6 문법으로 깔끔하게
    const {
        session: {
            user: {
                _id,
                avatarUrl,
                email: beforeEmail,
                username: beforeUsername,
                socialOnly,
            },
        },
        body: { name, email, username, location },
        file,
    } = req;

    // 소셜 로그인의 경우 email 수정 불가
    if (socialOnly && beforeEmail !== email) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This email can't change. Because Social Account!!",
        });
    }
    // session과 form의 email 다른지 검사
    if (beforeEmail !== email) {
        const exists = await User.exists({ email });
        // 업데이트 이메일이 존재하는지 검사
        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This email is already exist!!",
            });
        }
    }
    // session과 form의 username 다른지 검사
    if (beforeUsername !== username) {
        const exists = await User.exists({ username });
        // 업데이트 username이 존재하는지 검사
        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This username is already exist!!",
            });
        }
    }

    // mongoDB Update
    // avatar 파일이 업로드 된 경우에 해당 file로 저장, 아닐 경우 기존 avatarUrl 유지
    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    // Session Update
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};

// 비밀번호 변경 GET 컨트롤러 (비밀번호 변경 페이지 렌더링)
export const getChangePassword = (req, res) => {
    // 소셜 계정일 경우, 비밀번호가 없으므로 해당 페이지 접근 막기
    if (req.session.user.socialOnly) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {
        pageTitle: "Change Password",
    });
};

// 비밀번호 변경 POST 컨트롤러 (비밀번호 변경)
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordCheck },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);

    // 기존 패스워드 체크
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        });
    }
    // 신규 패스워드 체크
    if (newPassword !== newPasswordCheck) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        });
    }
    // 기존 패스워드와 신규 패스워드가 동일한지 체크
    if (oldPassword === newPassword) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The old password equals new password",
        });
    }

    // 신규 패스워드 업데이트
    user.password = newPassword;
    // save 또는 create할 경우에 미리 만들어둔 비밀번호 해싱이 이뤄짐
    await user.save();
    // 302 redirect 프록시 막기 위한 세션 파괴
    req.session.destroy();
    // send notification
    return res.redirect("/login");
};

export const see = (req, res) => res.send("See User!");
