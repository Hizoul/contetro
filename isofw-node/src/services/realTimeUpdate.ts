import * as feathers from "@feathersjs/feathers"
import val from "isofw-shared/src/globals/val"
import { PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"

const realTimeUpdate: any = (app: feathers.Application) => {
  const publisher: any = (data: any, context: any) => {
    return [
      app.channel(val.channels.gameUpdates)
      .filter((connection) => data[String(PlayersField.title)].indexOf(connection.user._id) !== -1)
    ]
  }
  app.service("gameSession").publish("patched", publisher)
  app.on("login", (payload, { connection }) => {
    if (connection) {
      app.channel(val.channels.gameUpdates).join(connection)
    }
  })
  return app
}

export default realTimeUpdate
