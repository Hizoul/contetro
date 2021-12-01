import { permission, validate } from "@xpfw/feathers-hooks"
import { Application } from "@feathersjs/feathers"

// use with app.configure(xpfwConfiguration)
const xpfwConfiguration = (app: Application) => {
  const service = app.service("users")
  service.hooks({
    before: {create: [
        permission.create(permissions),
        validate.general(schema, "create")
    ]}})
}

import { IPermissionSchema, Permission } from "@xpfw/permission"
import { ExtendedJSONSchema } from "@xpfw/form"
const permissions: IPermissionSchema = {
  required:{
    create:Permission.Public,
    update:Permission.User
  }
}
const schema: ExtendedJSONSchema = {
  title: "userModel",
  collection: "users",
  properties: {
    "email": {type: "string"},
    "password": {type: "string"}
  }
}

