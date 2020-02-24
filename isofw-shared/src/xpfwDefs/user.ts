import { MailField, PwField } from "@xpfw/data"
import { ensureDate } from "@xpfw/dm"
import { addTimeStamp, ExtendedJSONSchema, SchemaRegistry} from "@xpfw/form"
import { Permission, PermissionRegistry } from "@xpfw/permission"
import collections from "isofw-shared/src/xpfwDefs/collections"

const ColorField = {
  title: "color",
  type: "string",
  theme: "color"
}

const UserForm: ExtendedJSONSchema = {
  title: "userModel",
  collection: "users",
  properties: {
    [String(MailField.title)]: MailField,
    [String(PwField.title)]: PwField,
    [String(ColorField.title)]: ColorField
  },
  modify: [addTimeStamp("createdAt", ["create"]), ensureDate("createdAt", ["create", "update", "patch"])]
}

const UserPermission = {
  required: {
    create: Permission.Public,
    find: Permission.User,
    get: Permission.Public,
    update: Permission.Server,
    remove: Permission.Server
  }
}

SchemaRegistry.registerSchema(UserForm)
// PermissionRegistry.registerPermission("users", UserPermission)
collections.push("users")
export {
  UserForm, UserPermission, ColorField
}
