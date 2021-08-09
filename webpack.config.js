const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss"],
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      models: path.resolve(__dirname, "src/models/"),
      helpers: path.resolve(__dirname, "src/helpers/"),
      constants: path.resolve(__dirname, "src/constants/")
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["portal/styles"]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./public/index.html"
    }),
    new CopyWebpackPlugin([{ from: "public/assets", to: "assets" }]),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new Dotenv({
      path: process.env.ENV_FILE || "./.env"
    })
  ]
};
