/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const TodoWebpackPlugin = require("todo-webpack-plugin");
const glob = require("glob");
const PATHS = {
    src: path.join(__dirname, "src")
};

const isProduction = process.env.NODE_ENV === "production";

console.log("NODE_ENV:", process.env.NODE_ENV);

class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

module.exports = {
    node: {
        fs: "empty"
    },
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, "src/index.ts"),
    devtool: isProduction ? false : "source-map",
    devServer: {
        contentBase: [
            path.resolve(__dirname, "dist"),
            path.resolve(__dirname, "node_modules")
        ],
        compress: true,
        publicPath: "/",
        historyApiFallback: true,
        // set to false to disable hot reload
        hot: true,
        inline: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "./src/static"),
                to: path.resolve(__dirname, "dist"),
                ignore: [".*"]
            }
        ]),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
            inject: true
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/[hash].[name].css",
            chunkFilename: "css/[id].[hash].css"
        }),
        new ESLintPlugin({
            files: ["./src/**/*.tsx", "./src/**/*.ts"]
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "disabled",
            generateStatsFile: isProduction
        }),
        new HardSourceWebpackPlugin({
            // Either an absolute path or relative to webpack's options.context.
            cacheDirectory: path.resolve(
                __dirname,
                "node_modules/.cache/hard-source/[confighash]"
            ),
            // Clean up large, old caches automatically.
            cachePrune: {
                // Caches younger than `maxAge` are not considered for deletion. They must
                // be at least this (default: 2 days) old in milliseconds.
                maxAge: 2 * 24 * 60 * 60 * 1000,
                // All caches together must be larger than `sizeThreshold` before any
                // caches will be deleted. Together they must be at least this
                // (default: 50 MB) big in bytes.
                sizeThreshold: 50 * 1024 * 1024
            }
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
            extractors: [
                {
                    extractor: TailwindExtractor,
                    extensions: ["html", "ts", "tsx"]
                }
            ]
        }),
        new TodoWebpackPlugin({
            console: true
        })
    ],
    output: {
        filename: "[name].[hash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    optimization: {
        usedExports: true,
        moduleIds: "hashed",
        runtimeChunk: "single",
        minimize: isProduction,
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    },
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json"],
        alias: {
            components: path.resolve(
                __dirname,
                "./src/components/components.ts"
            ),
            views: path.resolve(__dirname, "./src/views/views.ts"),
            services: path.resolve(__dirname, "./src/services/"),
            context: path.resolve(__dirname, "./src/context/"),
            types: path.resolve(__dirname, "./src/types/"),
            helpers: path.resolve(__dirname, "./src/Shared/helpers/"),
            routes: path.resolve(__dirname, "./src/routes/routes.ts")
        }
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        publicPath: "/img",
                        outputPath: "img"
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        publicPath: "/fonts",
                        outputPath: "fonts"
                    }
                }
            },
            {
                test: /\.(js|tsx|ts)$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        sourceMap: isProduction
                    }
                }
            }
        ]
    }
};
