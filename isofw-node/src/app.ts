import "isofw-shared/src/xpfwDefs"

import * as authentication from "@feathersjs/authentication"
import jwt from "@feathersjs/authentication-jwt"
import * as local from "@feathersjs/authentication-local"
import * as handler from "@feathersjs/errors/handler"
import * as express from "@feathersjs/express"
import * as rest from "@feathersjs/express/rest"
import feathers, { Application, Service } from "@feathersjs/feathers"
import * as socketio from "@feathersjs/socketio"
import * as mongoServic from "feathers-mongodb"
import convertIds from "isofw-node/src/services/hooks/convertIds"
import disableInProd from "isofw-node/src/services/hooks/disableInProd"
import val from "isofw-shared/src/globals/val"
import * as path from "path"
import customServiceConfigurator from "./services/index"

const hooks = local.hooks

const makeApp: (prerender?: Service<any>, db?: any) => Application<any> = (prerender, db) => {
  // A Feathers app is the same as an Express app
  const app = express.default(feathers())
  // Parse HTTP JSON bodies
  app.use(express.json())
  // Parse URL-encoded params
  app.use(express.urlencoded({ extended: true }))
  // Add REST API support
  app.configure(rest())
  // Configure Socket.io real-time APIs
  app.configure(socketio())
  // Register our authentication plugin
  const options: any = {}
  options.secret = `mysecret`
  app.configure(authentication(options))
  // Register our local (username + password) authentication plugin
  app.configure(local())
  // Register our JWT authentication plugin
  app.configure(jwt())
  app.service("authentication").hooks({
    before: {
     create: [
      // You can chain multiple strategies
      authentication.hooks.authenticate(["local", "jwt"])
     ],
     remove: [
      authentication.hooks.authenticate("jwt")
     ]
    }
   })
  app.configure(customServiceConfigurator(db))

  app.service("users").hooks({
    // Make sure `password` never gets sent to the client
    after: hooks.protect("password"),
    before: {
      create: [
        hooks.hashPassword({ passwordField: "password" }),
        disableInProd
      ]
    }
  })
  app.use(`/`, express.static(path.resolve(val.isDebug ? `../../isofw-web/webpackDist` : "./app")))
  if (prerender !== undefined && prerender !== null && typeof(prerender) === `function`) {
    app.use("*", prerender)
  }
  // Register a nicer error handler than the default Express one
  const untypedHandler: any = handler
  app.use(untypedHandler())
  return app
}

export default makeApp
