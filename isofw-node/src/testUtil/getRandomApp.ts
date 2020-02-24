import * as authentication from "@feathersjs/authentication"
import * as handler from "@feathersjs/errors/handler"
import * as express from "@feathersjs/express"
import * as rest from "@feathersjs/express/rest"
import feathers, { Application, Service } from "@feathersjs/feathers"
import * as sios from "@feathersjs/socketio"
import * as memdb from "feathers-memory"
import * as mongoService from "feathers-mongodb"
import makeApp from "isofw-node/src/app"
import { DbStore, UserStore } from "isofw-shared/src/util/xpfwdata"
import collections from "isofw-shared/src/xpfwDefs/collections"
import { isString } from "lodash"
import { MongoClient } from "mongodb"
import emptyPort from "./emptyPort"
const sio: any = sios
const res: any = rest
const mongoServic: any = mongoService
const memd: any = memdb

const promisifyListen = (app: any, port: number) => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
}

const getRandomApp = async (ClientHolder?: any, useRest: boolean = false) => {
  const port = await emptyPort()
  const c = await MongoClient.connect(`mongodb://localhost:27017/`)
  const db  = c.db("contetrotests" + port)
  const app: any = makeApp(undefined, db)
  let server: any
  if (ClientHolder) {
    server = await promisifyListen(app, port)
    await ClientHolder.connectTo(`http://localhost:${port}`, {
      makeAuth: false,
      useRest,
      userStore: UserStore,
      dbStore: DbStore,
      collections
    })
  }
  return {
    app,
    port,
    cleanUp: async () => {
      await db.dropDatabase()
      await c.close()
      if (ClientHolder) {
        ClientHolder.disconnect(useRest)
        server.close()
      }
    }
  }
}

export default getRandomApp
