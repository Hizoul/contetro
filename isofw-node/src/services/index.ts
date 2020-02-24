import * as feathers from "@feathersjs/feathers"
import pluginCollections from "isofw-node/src/services/xpfw"
import val from "isofw-shared/src/globals/val"
import { PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"
import initGameSession from "./hooks/gameSession/initField"
import onlyAllowPlayers from "./hooks/gameSession/onlyAllowPlayers"
import populate from "./hooks/populate"
import playServiceConfigurator from "./play"
import realTimeUpdate from "./realTimeUpdate"
import userExpertDataServiceConfigurator from "./userExpertDataCollect"

const populatePlayers = populate({
  service: "/users",
  mapTo: `$${PlayersField.title}`,
  idsAt: `${PlayersField.title}`
})

const customServiceConfigurator: any = (db: any) => {
  return (app: feathers.Application) => {
    app.configure(pluginCollections(db))
    app.configure(playServiceConfigurator)
    app.configure(userExpertDataServiceConfigurator)
    // make sure game is initiated
    app.service(val.service.gameSession).hooks({
      before: {
        create: [
          onlyAllowPlayers,
          initGameSession
        ]
      },
      after: {
      }
    })
    app.configure(realTimeUpdate)
    return app
  }
}

export default customServiceConfigurator
