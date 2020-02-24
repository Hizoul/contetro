import { FormStore, memo } from "@xpfw/form"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import { logType } from "isofw-shared/src/gameLogic/globals"

const makeHistoryFromLog = (field: GameField) => {
  const history = []
  // TODO: game over place not shown in history
  for (let i = 0; i < field.log.log.length; i++) {
    const entry = field.log.log[i]
    if (entry != null && entry.type === logType.considering) {
      const nf = new GameField(field.players, new GameLog(field.log.log.slice(0, i + 1)))
      nf.playerColors = field.playerColors
      nf.deterministic_mode = true
      history.push(nf)
    }
  }
  return history
}

const fieldHistoryHook = (field: GameField) => {
  const history = memo(() => makeHistoryFromLog(field), ["history", JSON.stringify(field.log)])
  const indexSchema: any = {
    type: "number",
    title: "historyIndex",
    minimum: 0, maximum: history.length - 1,
    default: history.length - 1,
    format: "slider"
  }
  return {
    history,
    indexSchema,
    index: FormStore.getValue(indexSchema.title, undefined, history.length - 1)
  }
}

export default fieldHistoryHook
