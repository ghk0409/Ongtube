// entry: 소스코드, 처리하고자 하는 파일 (ex. main.js)
// path: webpack에 의해 변환된 결과 저장할 경로
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    mode: "development",
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/styles.css",
        }),
    ],
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
};
