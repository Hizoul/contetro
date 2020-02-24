const path = require("path")
const webpackConfig = {
  entry: `./src/index.tsx`,
  mode: "development",
  output: {
    filename: `isoapp.js`,
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "webpackDist/app")
  },
  plugins: [
  ],
  module: {
    rules: [ {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: `file-loader`
      }, {
        test: /\.(scss|sass)$/i,
        use: [
          {
            loader: `style-loader`
          }, {
            loader: `css-loader`
          }, {
            loader: `sass-loader`
          }
        ]
      }, {
        test: /\.(css)$/i,
        use: [
          {
            loader: `style-loader`
          }, {
            loader: `css-loader`
          }
        ]
      }, {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "fs": path.resolve(__dirname, "__mocks__", "fs.ts"),
      "isofw-web": __dirname,
      "isofw-shared": path.resolve(__dirname, `../isofw-shared`),
      "isofw-rn": path.resolve(__dirname, `../isofw-rn`),
      "isofw-node": path.resolve(__dirname, `../isofw-node`),
      "mobx-react-lite": path.resolve(__dirname, `./node_modules/mobx-react-lite`),
      "mobx": path.resolve(__dirname, `./node_modules/mobx`),
      "@xpfw/form": path.resolve(__dirname, `./node_modules/@xpfw/form`),
      "@xpfw/form-web": path.resolve(__dirname, `./node_modules/@xpfw/form-web`),
      "@xpfw/form-bulma": path.resolve(__dirname, `./node_modules/@xpfw/form-bulma`),
      "@xpfw/data-bulma": path.resolve(__dirname, `./node_modules/@xpfw/data-bulma`),
      "@xpfw/data": path.resolve(__dirname, `./node_modules/@xpfw/data`),
      "@xpfw/permission": path.resolve(__dirname, `./node_modules/@xpfw/permission`),
      "@xpfw/dm-shared": path.resolve(__dirname, `./node_modules/@xpfw/dm-shared`),
      "@xpfw/dm": path.resolve(__dirname, `./node_modules/@xpfw/dm`)
    }
  }
}

module.exports = webpackConfig
