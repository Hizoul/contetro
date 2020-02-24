import makeApp from "isofw-node/src/app"
import { get, isObject, isString } from "lodash"
import { MongoClient } from "mongodb"

let mongoUrl: any = `mongodb://localhost:27017/`

if (isObject(global.process) && isString(process.env.MONGO_URL)) {
  mongoUrl = process.env.MONGO_URL
}
console.log("Attempting to connect to database")
MongoClient.connect(mongoUrl, {useNewUrlParser: true}).then((c: any) => {

  const db = c.db("contetro")

  console.log("Attempting to start Server")
  const app: any = makeApp(undefined, db)
  app.listen(4202, () => {
    console.log("Now listening on http://localhost:4202")
  })
})
