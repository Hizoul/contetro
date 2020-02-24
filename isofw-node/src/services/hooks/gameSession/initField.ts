import { Hook } from "@feathersjs/feathers"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import val from "isofw-shared/src/globals/val"
import { GameOverField, LogField, PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"
import { get } from "lodash"

// makes sure that the beginning player as well as the consideration are created
const initGameSession: Hook = async (hook) => {
  const players = get(hook, `data.${PlayersField.title}`)
  const gameField = new GameField(players, undefined, true)
  hook.data[String(LogField.title)] = gameField.log.log
  hook.data[String(GameOverField.title)] = false
  return hook
}

export default initGameSession
