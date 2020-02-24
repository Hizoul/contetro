const configuration = require("./webpack.config")

const modifyConf = configuration

modifyConf.entry = "./src/expertIndex"

module.exports = modifyConf
