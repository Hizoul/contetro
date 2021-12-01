import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import { logType } from "isofw-shared/src/gameLogic/globals"
import { cloneDeep } from "lodash"

const exampleRustLog = `{"log":[{"PayloadPlaced":{"x":0,"y":0,"block":0,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":3}},{"PayloadPlaced":{"x":0,"y":1,"block":3,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":0}},{"PayloadPlaced":{"x":0,"y":3,"block":0,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":1}},{"PayloadPlaced":{"x":0,"y":4,"block":1,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":2}},{"PayloadPlaced":{"x":1,"y":6,"block":2,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":2}},{"PayloadPlaced":{"x":0,"y":8,"block":2,"orientation":1,"from":0}},{"PayloadRolled":{"from":1,"block":0}},{"PayloadPlaced":{"x":1,"y":9,"block":0,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":2}},{"PayloadPlaced":{"x":1,"y":10,"block":2,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":0}},{"PayloadPlaced":{"x":0,"y":12,"block":0,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":4}},{"PayloadPlaced":{"x":0,"y":13,"block":4,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":3}},{"PayloadPlaced":{"x":0,"y":14,"block":3,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":0}},{"PayloadPlaced":{"x":0,"y":16,"block":0,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":1}},{"PayloadPlaced":{"x":0,"y":17,"block":1,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":3}},{"PayloadPlaced":{"x":0,"y":19,"block":3,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":3}},{"PayloadPlaced":{"x":3,"y":17,"block":3,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":4}},{"PayloadPlaced":{"x":3,"y":19,"block":4,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":3}},{"PayloadPlaced":{"x":6,"y":0,"block":3,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":2}},{"PayloadPlaced":{"x":6,"y":2,"block":2,"orientation":1,"from":0}},{"PayloadRolled":{"from":1,"block":1}},{"PayloadPlaced":{"x":6,"y":4,"block":1,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":3}},{"PayloadPlaced":{"x":6,"y":6,"block":3,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":3}},{"PayloadPlaced":{"x":6,"y":8,"block":3,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":3}},{"PayloadPlaced":{"x":6,"y":10,"block":3,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":1}},{"PayloadPlaced":{"x":6,"y":12,"block":1,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":3}},{"PayloadPlaced":{"x":6,"y":14,"block":3,"orientation":0,"from":0}},{"PayloadRolled":{"from":1,"block":0}},{"PayloadPlaced":{"x":6,"y":16,"block":0,"orientation":0,"from":1}},{"PayloadRolled":{"from":0,"block":2}},{"PayloadPlaced":{"x":6,"y":18,"block":2,"orientation":1,"from":0}},{"PayloadRolled":{"from":1,"block":2}},{"PayloadPlaced":{"x":7,"y":20,"block":2,"orientation":2,"from":1}},{"PayloadSkipped":{"from":0,"block":3,"reason":0}},{"PayloadRolled":{"from":1,"block":3}},{"PayloadPlaced":{"x":9,"y":18,"block":3,"orientation":1,"from":1}},{"PayloadRolled":{"from":0,"block":1}},{"PayloadConsidering":{"play_index":0}},{"PayloadPlaced":{"x":9,"y":19,"block":1,"orientation":0,"from":0}},{"PayloadSkipped":{"from":1,"block":0,"reason":0}},{"PayloadSkipped":{"from":1,"block":1,"reason":1}},{"PayloadSkipped":{"from":0,"block":3,"reason":0}},{"PayloadSkipped":{"from":1,"block":0,"reason":0}},{"PayloadSkipped":{"from":0,"block":1,"reason":1}}]}`

const scoreExampleRustLog = `{\"log\":[{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":0,\"x\":8,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":0,\"x\":6,\"y\":0}},{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":0,\"x\":4,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":0,\"x\":7,\"y\":2}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":6,\"y\":2}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":7,\"y\":3}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":6,\"y\":6}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":6,\"y\":10}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":2,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":6,\"y\":14}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadPlaced\":{\"from\":1,\"block\":4,\"orientation\":1,\"x\":7,\"y\":5}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":5,\"x\":9,\"y\":3}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadPlaced\":{\"from\":1,\"block\":4,\"orientation\":3,\"x\":8,\"y\":6}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":10,\"y\":6}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":2,\"y\":2}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":5,\"x\":8,\"y\":7}},{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":2,\"x\":4,\"y\":2}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":1,\"x\":7,\"y\":10}},{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":0,\"x\":4,\"y\":3}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":2,\"y\":6}},{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":3,\"x\":5,\"y\":5}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":9,\"y\":10}},{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":3,\"x\":4,\"y\":6}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadPlaced\":{\"from\":0,\"block\":2,\"orientation\":3,\"x\":8,\"y\":11}},{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":1,\"x\":4,\"y\":9}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":3,\"x\":7,\"y\":12}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadPlaced\":{\"from\":1,\"block\":4,\"orientation\":1,\"x\":0,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":1,\"x\":4,\"y\":12}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":9,\"y\":12}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":9,\"y\":14}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadPlaced\":{\"from\":1,\"block\":4,\"orientation\":3,\"x\":0,\"y\":3}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":5,\"x\":0,\"y\":4}},{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":1,\"x\":4,\"y\":14}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":7,\"x\":0,\"y\":5}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadPlaced\":{\"from\":1,\"block\":4,\"orientation\":7,\"x\":1,\"y\":8}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":9,\"y\":16}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":3,\"y\":4}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadPlaced\":{\"from\":0,\"block\":2,\"orientation\":3,\"x\":5,\"y\":15}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":3,\"y\":8}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":9,\"y\":18}},{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":1,\"x\":2,\"y\":12}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":1,\"x\":2,\"y\":15}},{\"PayloadSkipped\":{\"from\":1,\"block\":4,\"reason\":1}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":5,\"x\":7,\"y\":15}},{\"PayloadSkipped\":{\"from\":1,\"block\":0,\"reason\":1}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadPlaced\":{\"from\":0,\"block\":2,\"orientation\":2,\"x\":3,\"y\":16}},{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":3,\"x\":0,\"y\":10}},{\"PayloadSkipped\":{\"from\":0,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":2,\"y\":17}},{\"PayloadSkipped\":{\"from\":0,\"block\":4,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":4,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":4,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":4,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":2,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":4,\"reason\":1}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":4,\"y\":17}},{\"PayloadSkipped\":{\"from\":0,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":2,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":2,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":0,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":0,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":4,\"reason\":1}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":2,\"y\":19}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":3,\"reason\":1}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadPlaced\":{\"from\":0,\"block\":2,\"orientation\":2,\"x\":7,\"y\":18}},{\"PayloadSkipped\":{\"from\":1,\"block\":3,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":1,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":0,\"reason\":1}},{\"PayloadSkipped\":{\"from\":0,\"block\":0,\"reason\":1}},{\"PayloadSkipped\":{\"from\":1,\"block\":4,\"reason\":1}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadConsidering\":{\"play_index\":0}}]}`


const heuristicLog1 = "{\"log\":[{\"PayloadRolled\":{\"from\":1,\"block\":2}},{\"PayloadPlaced\":{\"from\":1,\"block\":2,\"orientation\":0,\"x\":1,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":3}},{\"PayloadPlaced\":{\"from\":0,\"block\":3,\"orientation\":1,\"x\":2,\"y\":2}},{\"PayloadRolled\":{\"from\":1,\"block\":3}},{\"PayloadPlaced\":{\"from\":1,\"block\":3,\"orientation\":0,\"x\":0,\"y\":2}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":2,\"y\":4}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":0,\"x\":5,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":4}},{\"PayloadPlaced\":{\"from\":0,\"block\":4,\"orientation\":2,\"x\":4,\"y\":0}},{\"PayloadRolled\":{\"from\":1,\"block\":4}},{\"PayloadConsidering\":{\"play_index\":0}}]}";

const heuristicLog2 = "{\"log\":[{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":0,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":1}},{\"PayloadPlaced\":{\"from\":0,\"block\":1,\"orientation\":0,\"x\":8,\"y\":0}},{\"PayloadRolled\":{\"from\":1,\"block\":1}},{\"PayloadPlaced\":{\"from\":1,\"block\":1,\"orientation\":0,\"x\":2,\"y\":0}},{\"PayloadRolled\":{\"from\":0,\"block\":0}},{\"PayloadPlaced\":{\"from\":0,\"block\":0,\"orientation\":1,\"x\":3,\"y\":2}},{\"PayloadRolled\":{\"from\":1,\"block\":0}},{\"PayloadPlaced\":{\"from\":1,\"block\":0,\"orientation\":1,\"x\":3,\"y\":6}},{\"PayloadRolled\":{\"from\":0,\"block\":2}},{\"PayloadConsidering\":{\"play_index\":0}}]}";


const rustPlaced = "PayloadPlaced"
const rustRolled = "PayloadRolled"
const rustSkipped = "PayloadSkipped"
const rustConsidering = "PayloadConsidering"

const payloadConvert = {
  [logType.placed]: rustPlaced,
  [logType.rolled]: rustRolled,
  [logType.skipped]: rustSkipped,
  [logType.considering]: rustConsidering,
  [rustPlaced]: logType.placed,
  [rustSkipped]: logType.skipped,
  [rustRolled]: logType.rolled,
  [rustConsidering]: logType.considering
}

const makeToPlayer = (from: any, players?: string[]) => {
  if (players != null) {
    return players[from]
  }
  return from
}

const rustToJsLog = (log: string, players?: string[]) => {
  const g: GameLog = new GameLog()
  const p: any = JSON.parse(log)
  if (p != null && p.log != null && Array.isArray(p.log)) {
    for (const entry of p.log) {
      if (entry[rustPlaced] != null) {
        const payload = entry[rustPlaced]
        g.blockPlaced(makeToPlayer(payload.from, players), payload.block, payload.orientation, payload.x, payload.y)
      } else if (entry[rustRolled] != null) {
        const payload = entry[rustRolled]
        g.rolledBlock(makeToPlayer(payload.from, players), payload.block)
      } else if (entry[rustSkipped] != null) {
        const payload = entry[rustSkipped]
        g.playerSkipped(makeToPlayer(payload.from, players), payload.block, payload.reason)
      } else if (entry[rustConsidering] != null) {
        const payload = entry[rustConsidering]
        g.log.push({
          type: logType.considering,
          payload: {
            play_index: payload.play_index
          }
        })
      }
    }
  }
  return g
}

const jsToRustLog = (jsLog: GameLog, players: string[]) => {
  const log: any[] = []
  for (const e of cloneDeep(jsLog.log)) {
    if (e.payload != null && e.payload.from) {
      e.payload.from = players.indexOf(e.payload.from)
    }
    if (e.type === logType.placed) {
      log.push({[rustPlaced]: e.payload})
    } else if (e.type === logType.rolled) {
      log.push({[rustRolled]: e.payload})
    } else if (e.type === logType.skipped) {
      log.push({[rustSkipped]: e.payload})
    } else if (e.type === logType.considering) {
      log.push({[rustConsidering]: e.payload})
    }
  }
  return JSON.stringify({log})
}

export {
  exampleRustLog,
  rustToJsLog,
  jsToRustLog,
  scoreExampleRustLog,
  heuristicLog1,
  heuristicLog2
}
