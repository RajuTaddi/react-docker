const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpack = require("webpack");
const path = require("path");

let DIST_DIR = "build";

if (!!process.env.BUILD_ENV) {
  DIST_DIR = `${DIST_DIR}/${DIST_DIR}-${process.env.BUILD_ENV}`;
}

module.exports = {
  entry: "./src/index.tsx",
  devServer: {
    contentBase: [DIST_DIR],
    port: 3003,
  },
  output: {
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, DIST_DIR),
  },
  mode: "development",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/assets/img",
        to: "img",
      },
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "awesome-typescript-loader",
          },
        ],
      },
      // move all fonts into their own dir
      {
        test: /\.(woff(2)?|tff|eot)(\?v=\d+\.\d+\.\d+)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      // move all images to their own dir
      {
        test: /\.(git|png|jpe?g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
              outputPath: "img/",
            },
          },
        ],
      },
      // move all css files
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
};
