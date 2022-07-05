import User from "../models/User";

// 회원가입(join) 컨트롤러
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { name, email, username, password, location } = req.body;

    await User.create({
        name,
        email,
        username,
        password,
        location,
    });
    return res.redirect("/login");
};

export const edit = (req, res) => res.send("Edit users");

export const remove = (req, res) => res.send("remove user!");

export const login = (req, res) => res.send("Login user");

export const logout = (req, res) => res.send("Logout!!");

export const see = (req, res) => res.send("See User!");
