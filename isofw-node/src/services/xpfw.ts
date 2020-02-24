import authentication from "@feathersjs/authentication"
import { StatRegistry } from "@xpfw/dm"
import { permission, validate } from "@xpfw/feathers-hooks"
import * as mongoService from "feathers-mongodb"
import convertIds from "isofw-node/src/services/hooks/convertIds"
import { SchemaRegistry } from "isofw-shared/src/util/xpfwform"
import { PermissionRegistry } from "isofw-shared/src/util/xpfwpermission"
import collections from "isofw-shared/src/xpfwDefs/collections"
import { get } from "lodash"

const auth: any = authentication
const mognoServic: any = mongoService
const pluginCollections = (db: any) => {
  return async (app: any) => {
    for (const collection of collections) {
      const col = db.collection(collection)
      const service = new mognoServic({
        Model: col,
        paginate: {
          default: 10,
          max: 100
        },
        whitelist: ["$regex", "$options", "$skip", "$limit", "$sort"]
      })
      app.use(collection, service)
      const servic = app.service(collection)
      const schema: any = SchemaRegistry.getSchema(collection)
      const stats = get(schema, "custom.stats", [])
      for (const stat of stats) {
        StatRegistry.register(stat.id, stat)
      }
      const permissions: any = PermissionRegistry.getPermission(collection)
      const opts: any = {
        idPath: "_id", serviceName: collection, directOwnershipPath: "belongsTo"
      }
      console.log("FOR COLLECTION ", collection, permissions, schema)
      servic.hooks({
        before: {
          create: collection === "users" ? [] : [
            auth.hooks.authenticate("jwt"),
            permission.create(permissions, opts),
            validate.general(schema, "create", opts),
            convertIds("_id", false)
          ],
          update: [
            auth.hooks.authenticate("jwt"),
            permission.update(permissions, opts),
            validate.general(schema, "update", opts),
            convertIds("_id", false)
          ],
          find: [
            // permission.general(permissions, "find", opts),
            // validate.general(schema, "find", opts),
            // convertIds("_id", true)
            (hook: any) => {
              console.log("HOOK IS ", hook.params, hook.query)
              return hook
            }
          ],
          get: [
            // permission.general(permissions, "get", opts)
          ],
          patch: [
            // auth.hooks.authenticate("jwt"),
            // permission.general(permissions, "update", opts),
            validate.general(schema, "update", opts),
            convertIds("_id", false)
          ],
          remove: [
            auth.hooks.authenticate("jwt"),
            permission.general(permissions, "remove", opts),
            validate.general(schema, "remove", opts)
          ]
        },
        error: (context: any) => {
          console.log("ERROR IN HOOK", collection, context.method, context.error.stack)
        }
      })
    }
  }
}

export default pluginCollections
