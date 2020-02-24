import { MailField } from "@xpfw/data"
import { addTimeStamp, ExtendedJSONSchema, SchemaRegistry} from "isofw-shared/src/util/xpfwform"
import { Permission, PermissionRegistry } from "isofw-shared/src/util/xpfwpermission"
import collections from "isofw-shared/src/xpfwDefs/collections"

// const validatePlayerInside: ValidateFunction = (value, opts, additionalParams) => {
//   if (Array.isArray(value)) {
//     const userId = get(additionalParams, "currentUser._id")
//     if (value.indexOf(userId) === -1) {
//       value.push(userId)
//     }
//     if (value.length < 2 || value.length > 4) {
//       return Promise.reject("invalid size")
//     }
//   }
//   return Promise.resolve(value)
// }

const CreatedAtField: ExtendedJSONSchema = {
  title: "createdAt",
  type: "number",
  hide: {create: true}
}

const GameOverField: ExtendedJSONSchema = {
  title: "gameOver",
  type: "boolean",
  default: false,
  hide: {create: true}
}

const RewardField: ExtendedJSONSchema = {
  title: "reward",
  type: "number",
  hide: {create: true}
}

const RewardEnemyField: ExtendedJSONSchema = {
  title: "rewardEnemy",
  type: "number",
  hide: {create: true}
}

const PlayersField: ExtendedJSONSchema = {
  title: "players",
  type: "array",
  theme: "multi",
  relationship: {
    namePath: MailField.title,
    collection: "users",
    idPath: "_id"
  }
}

const LogField: ExtendedJSONSchema = {
  title: "log",
  type: "array",
  theme: "multi",
  items: {
    type: "object"
  },
  hide: {create: true}
}

// const getPermissionCheck: any = async (currentUser: any, options: any) => {
//   console.log("doing get perm check")
//   if (options.method === "get" && options.custom.feathers) {
//     const doc = await options.custom.feathers.service("gameSession").get(options.docId)
//     console.log("DOING GET PERMISSION CHECK WITH ", doc)
//     if (doc == null) {
//       return false
//     }
//     if (doc[PlayersField.title].indexOf(currentUser._id) === -1) {
//       return false
//     }
//     return true
//   }
//   return Promise.resolve(undefined)
// }

const GameSessionForm: ExtendedJSONSchema = {
  title: "gameForm",
  collection: "gameSession",
  properties: {
    [String(PlayersField.title)]: PlayersField,
    [String(LogField.title)]: LogField,
    [String(GameOverField.title)]: GameOverField,
    [String(RewardField.title)]: RewardField,
    [String(RewardEnemyField.title)]: RewardEnemyField,
    [String(CreatedAtField.title)]: CreatedAtField
  },
  modify: [addTimeStamp(String(CreatedAtField.title), ["create"])]
}
const permissions = {
  required: {
    create: Permission.User,
    find: Permission.User,
    get: Permission.User,
    update: Permission.Server,
    remove: Permission.Server
  }
}

SchemaRegistry.registerSchema(GameSessionForm)
PermissionRegistry.registerPermission("gameSession", permissions)
collections.push("gameSession")
export {
  GameSessionForm, PlayersField, LogField, CreatedAtField, GameOverField, RewardField, RewardEnemyField
}
