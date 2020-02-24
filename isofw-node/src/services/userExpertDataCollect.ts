import * as feathers from "@feathersjs/feathers"
import serverPermissions from "isofw-node/src/serverPerm"
import val from "isofw-shared/src/globals/val"
import { CreatedAtField, PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"
import { isString } from "lodash"

const getActiveGameForUser = async (app: any, userId: any) => {
  console.log("searching for active game for ", userId)
  const gameList = await app.service(val.service.gameSession).find({
    ...serverPermissions, query: {players: userId, gameOver: false}
  })
  if (gameList != null && Array.isArray(gameList.data) && gameList.data.length > 0) {
    console.log("user has active game ", userId, gameList.data[0]._id)
    return gameList.data[0]._id
  }
  console.log("found no game for user", userId)
  return -1
}

const lastGameWasAgainstSetWeights = async (app: any, userId: any) => {
  console.log("searching for last game for ", userId)
  const gameList = await app.service(val.service.gameSession).find({
    ...serverPermissions, query: {players: userId, $sort: {createdAt: -1}}
  })
  if (gameList != null && Array.isArray(gameList.data) && gameList.data.length > 0) {
    console.log("user has last game ", userId, gameList.data[0].players[1])
    return gameList.data[0].players[1] === "bot_heuristics"
  }
  console.log("found no game for user", userId)
  return false
}

const getActiveGame = (app: feathers.Application) => {
  return async (userId: any, params: any) => {
    if (!isString(userId)) {
      return Promise.reject("invalid input data")
    }
    return getActiveGameForUser(app, userId.substring(1))
  }
}

const createGame = (app: feathers.Application) => {
  return async (userId: any, data: any, params: any) => {
    if (!isString(userId)) {
      return Promise.reject("invalid input data")
    }
    const game = await getActiveGameForUser(app, userId)
    if (game === -1) {
      const wasAgainstRegularHeu = await lastGameWasAgainstSetWeights(app, userId)
      const newGame = await app.service(val.service.gameSession).create({
        [String(PlayersField.title)]: [userId, wasAgainstRegularHeu ? "bot_random" : "bot_heuristics"],
        [String(CreatedAtField.title)]: Date.now()
      }, serverPermissions)
      console.log("FOR ", userId, " created ", newGame)
      return newGame._id
    }
    return -1
  }
}

const userExpertDataServiceConfigurator: any = (app: feathers.Application) => {
  const userExpertDataService: any = {
    get: getActiveGame(app),
    patch: createGame(app)
  }
  app.use(val.service.expertData, userExpertDataService)
  return app
}

export default userExpertDataServiceConfigurator
