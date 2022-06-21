// fake video database
let videos = [
    {
        title: "고담시티2",
        rating: 5,
        comments: 3,
        createdAt: "2 minutes ago",
        views: 49,
        id: 0,
    },
    {
        title: "범죄도시2",
        rating: 5,
        comments: 23,
        createdAt: "5 minutes ago",
        views: 128,
        id: 1,
    },
    {
        title: "쥬라기월드 에볼루션",
        rating: 4,
        comments: 82,
        createdAt: "12 minutes ago",
        views: 1223,
        id: 2,
    },
    {
        title: "신세계백화점",
        rating: 3,
        comments: 53,
        createdAt: "19 minutes ago",
        views: 149,
        id: 3,
    },
];

export const trending = (req, res) =>
    res.render("home", { pageTitle: "Home", videos });

export const watch = (req, res) => {
    // ES6 문법 사용 (옆과 동알 -> const id = req.params.id;)
    const { id } = req.params;
    const video = videos[id];
    res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });

export const search = (req, res) => res.send("Search Videos");

export const upload = (req, res) => res.send("Upload Video!!");

export const deleteVideo = (req, res) => res.send("Delete Video!!");
