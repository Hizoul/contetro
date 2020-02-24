import * as CopyWebpackPlugin from "copy-webpack-plugin"
import * as fs from "fs"
import * as gracefulFs from "graceful-fs"
import * as path from "path"
import * as webpack from "webpack"
import configuration from "./webpack.config.server"
gracefulFs.gracefulify(fs)
const untypedConfiguration: any = configuration
untypedConfiguration.mode = "production"
untypedConfiguration.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
// untypedConfiguration.plugins.push(new UglifyJs())

const serverPath = path.resolve(__dirname, `../isofw-node`)
untypedConfiguration.plugins.push(
  new CopyWebpackPlugin([
    {from: `${serverPath}/node_modules`, to: `${serverPath}/webpackDist/node_modules` }
  ])
)

export default untypedConfiguration
