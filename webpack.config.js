/* ******************************************************************************
 * Classification: UNCLASSIFIED
 ***************************************************************************** */
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HappyPack = require("happypack");

const config = {
  entry: ["@babel/polyfill", path.resolve(__dirname, "src/index.jsx")],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src/"),
    },
    // If an import doesn't have an extension, resolve to one of these
    extensions: [".js", ".jsx"],
  },
  plugins: [
    // Copy index.html and favicon to dist/
    new CopyWebpackPlugin({
      patterns: [
        { from: "./index.html" },
        { from: "./favicon.ico" },
        { from: "./**/*.worker.js" },
      ],
    }),
    /**
     * Transforms files in parallel
     * @see https://github.com/amireh/happypack
     */
    new HappyPack({
      threads: 4,
      loaders: ["babel-loader?compact=false"],
    }),
  ],
  module: {
    rules: [
      {
        // Run babel on all jsx? files inside src
        test: /\.jsx?$/,
        include: [path.resolve("src/")],
        loader: "happypack/loader",
      },
      {
        test: /\.worker\.js$/,
        loader: "worker-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|ttf|eot|otf)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(mov|mp4|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.woff/,
        use: ["url-loader"],
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv && argv.mode === "production") {
    // Passed `--mode production`
    config.mode = "production";
    config.cache = false;
    config.devtool = "eval-source-map";
    config.performance = {
      hints: false,
    };
    // Delete contents of /dist
    config.plugins.push(new CleanWebpackPlugin());
  } else {
    // Default to development setup
    config.mode = "development";
    config.cache = false;
    config.devtool = "eval-source-map";
    config.devServer = {
      compress: true,
      port: 9000,
      host: "0.0.0.0",
    };
  }

  // Passed `--debug` to webpack
  if (argv && argv.debug) {
    config.performance = {
      hints: "warning",
    };
  }
  return config;
};
