import authentication from "@feathersjs/authentication"
import * as feathers from "@feathersjs/feathers"
import { useExecutableForAnswer } from "isofw-node/src/rusty/rustLib"
import serverPermissions from "isofw-node/src/serverPerm"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import command from "isofw-shared/src/globals/commands"
import val from "isofw-shared/src/globals/val"
import { jsToRustLog, rustToJsLog } from "isofw-shared/src/util/rustLogParser"
import { GameOverField, GameSessionForm, LogField, PlayersField, RewardEnemyField, RewardField } from "isofw-shared/src/xpfwDefs/gameLog"
import { get, isNumber, isString } from "lodash"
const col: any = GameSessionForm.collection

const auth: any = authentication

const isBotsTurn = (field: GameField) => field.log.getCurrentPlayer().indexOf("bot_") !== -1

const makePlayFunction = (app: feathers.Application) => {
  return async (data: any, params: any) => {
    try {
    let userId = get(params, "user._id")
    if (userId != null && userId.toHexString != null) {
      userId = userId.toHexString()
    }
    const gameId = get(data, "gameId")
    const commandType = get(data, "commandType")
    if (!isString(userId) || !isString(gameId)  || !isNumber(commandType)) {
      return Promise.reject("invalid input data")
    }

    const game = await app.service(col).get(gameId, params)
    const players = get(game, String(PlayersField.title), [])
    if (players.indexOf(userId) === -1) {
      console.log("userid not in players", players, userId)
      return Promise.reject("not part of game")
    }
    let field = new GameField(players, new GameLog(get(game, String(LogField.title))), true)
    const possiblePlays = field.getPossiblePlays()
    const gameShouldBeOver = field.gameOver || possiblePlays.length === 0
    const isPlayersTurn = true // field.log.getCurrentPlayer() === userId
    if (gameShouldBeOver || !isPlayersTurn) {
      if (gameShouldBeOver && game[String(GameOverField.title)] !== false) {
        return app.service(col).patch(gameId, {[String(GameOverField.title)]: true}, serverPermissions)
      }
      console.log("rejecting", gameShouldBeOver, isPlayersTurn)
      return Promise.reject("can't make turn")
    }
    console.log("executing command")
    let fieldChanged = false
    switch (commandType) {
      case command.moveBlock: {
        field.moveBlock(get(data, "commandPayload") === true)
        fieldChanged = true
        break
      }
      case command.rotateBlock: {
        field.rotateBlock(get(data, "commandPayload") === true)
        fieldChanged = true
        break
      }
      case command.makePlay:
      case command.placeUsingPlay: {
        field.placeBlockUsingPlay(commandType == command.placeUsingPlay ? get(data, "play_index", 0) : field.log.getCurrentPlay())
        if (!field.gameOver && isBotsTurn(field)) {
          console.log("ABOUT TO MAKE BOTPLAY")
          const logAfterBotsTurn: any = await useExecutableForAnswer(field)
          console.log("RESULT IS", logAfterBotsTurn)
          if (logAfterBotsTurn != null) {
            field = new GameField(players, logAfterBotsTurn, true)
            field.log.rolledBlock(userId, 0)
          }
        }
        fieldChanged = true
        break
      }
      case command.changeBlock: {
        field.switchBlock(get(data, "commandPayload") === true)
        fieldChanged = true
        break
      }
    }
    if (fieldChanged) {
      console.log("FILED CHANGED UPDATING", field.gameOver, field.getPossiblePlays().length)
      let reward = -1
      let rewardEnemy = -1
      if (field.gameOver) {
        console.log("GETTING REWARD FO RPLAYER 0")
        const rewards: any = await useExecutableForAnswer(field)
        reward = rewards[0]
        console.log("GETTING REWARD FO RPLAYER 1")
        rewardEnemy = rewards[1]
      }
      console.log("SUBMITTING PATCH", field.gameOver)
      return app.service(col).patch(gameId, {
        [String(LogField.title)]: field.log.log,
        [String(RewardField.title)]: reward,
        [String(RewardEnemyField.title)]: rewardEnemy,
        [String(GameOverField.title)]: field.gameOver
      }, serverPermissions)
    }
  } catch (e) {
    console.error(e)
  }
    return Promise.resolve("nothing to do")
  }
}

const playServiceConfigurator: any = (app: feathers.Application) => {
  const playService: any = {
    create: makePlayFunction(app)
  }
  app.use(val.service.play, playService)
  app.service(val.service.play).hooks({
    before: {
      create: [
        auth.hooks.authenticate("jwt")
      ]
    }
  })
  return app
}

export default playServiceConfigurator
