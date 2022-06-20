export const trending = (req, res) => {
    const videos = [
        {
            title: "고담시티",
            rating: 5,
            comments: 3,
            createdAt: "2 minutes ago",
            views: 49,
            id: 1,
        },
        {
            title: "범죄도시2",
            rating: 5,
            comments: 23,
            createdAt: "5 minutes ago",
            views: 128,
            id: 2,
        },
        {
            title: "쥬라기월드 에볼루션",
            rating: 4,
            comments: 82,
            createdAt: "12 minutes ago",
            views: 316,
            id: 3,
        },
        {
            title: "신세계백화점",
            rating: 3,
            comments: 53,
            createdAt: "19 minutes ago",
            views: 149,
            id: 4,
        },
    ];
    res.render("home", { pageTitle: "Home", videos });
};

export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });

export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });

export const search = (req, res) => res.send("Search Videos");

export const upload = (req, res) => res.send("Upload Video!!");

export const deleteVideo = (req, res) => res.send("Delete Video!!");
