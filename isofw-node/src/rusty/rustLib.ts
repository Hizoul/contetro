import { exec } from "child_process"
import * as ffi from "ffi-napi"
import { writeFileSync } from "fs"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import { jsToRustLog, rustToJsLog } from "isofw-shared/src/util/rustLogParser"
import { resolve } from "path"
import * as tmp from "tmp"
import { GameField } from "../../../isofw-shared/src/gameLogic/gameField"

// Interface into the native lib
// console.log("ABOUT TO LOAD LIB", resolve(__dirname, "rustyblocks.dll"))
// const rustyBlocks = ffi.Library(resolve(__dirname, "rustyblocks.dll"), {
//   field_new: ["pointer", []],
//   field_free: ["void", ["pointer"]],
//   free_string: ["void", ["string"]],
//   field_to_json_log: ["string", ["pointer"]],
//   field_restore_log: ["void", ["pointer", "string"]],
//   field_do_action: ["uint8", ["pointer", "uint8"]],
//   field_counter_action: ["uint8", ["pointer", "int8"]],
//   field_get_full_reward: ["double", ["pointer", "int8"]]
// })

// const getFullReward = (rustLog: string, player: number) => {
//   const field = rustyBlocks.field_new()
//   rustyBlocks.field_restore_log(field, rustLog)
//   const reward = rustyBlocks.field_get_full_reward(field, player)
//   // rustyBlocks.field_free(field)
//   return reward
// }

// const makeBotPlay = (rustLog: string, players: string[]) => {
//   const field = rustyBlocks.field_new()
//   rustyBlocks.field_restore_log(field, rustLog)
//   rustyBlocks.field_counter_action(field, -1)
//   const resultJson = rustyBlocks.field_to_json_log(field)
//   const log = rustToJsLog(resultJson, players)
//   // rustyBlocks.field_free(field)
//   // rustyBlocks.free_string(resultJson)
//   return log
// }
const isWindows = process.platform === "win32"

const useExecutableForAnswer = (field: GameField) => {
  return new Promise((promiseResolver) => {
    const currentPlayer = field.log.getCurrentPlayer()
    // console.log("ABOUT TO SEND", jsToRustLog(field.log, field.players).replace(/\"/g, "\\\""))
    const commandToExecute = resolve(__dirname, `rustyblocks${isWindows ? ".exe" : ""}`)
    const commandDistance = "__RUSTYBLOCKS__\n".length
    // if // (!field.gameOver && currentPlayer != null && currentPlayer === "bot_rl") {
    //   commandToExecute = "python ai.py 1"
    //   commandDistance += 1
    // }
    const tmpFileName = tmp.fileSync()
    let playerNum = "regular"
    if (currentPlayer === "bot_random") {
      playerNum = "random"
    }
    writeFileSync(tmpFileName.name, jsToRustLog(field.log, field.players))
    writeFileSync("./rustlog.json", jsToRustLog(field.log, field.players))
    const command = `${commandToExecute} ${playerNum} ${tmpFileName.name}`
    console.log("USING COMMAND" , command)

    exec(command, {
      env: {...process.env, RUST_BACKTRACE: "full", TF_CPP_MIN_LOG_LEVEL: "3"},
      cwd: __dirname
    }, (err, stdout, stderr) => {
      console.log("STD OUTPUT IS", stdout)
      console.log("ERR IS", err, stderr)
      tmpFileName.removeCallback()
      const toUse = stdout.substr(stdout.indexOf("__RUSTYBLOCKS__") + commandDistance)
      const resultType = toUse.substr(0, 2)
      console.log("RESULTTYPE", resultType, toUse)
      if (resultType === "1;") {
        promiseResolver(rustToJsLog(toUse.substr(2), field.players))
      } else if (resultType === "0;") {
        const nums = toUse.substr(2).split("\n").map((v) => Number(v))
        console.log("NUM RESULT IS", toUse.substr(2).split("\n"), nums)
        promiseResolver(nums)
      } else {
        promiseResolver(undefined)
      }
      })
  })
}
process.on("uncaughtException", function(exception) {
  console.log("uncaught exception", exception)
})
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason)
  // application specific logging, throwing an error, or other logic here
})

export {
  // rustyBlocks,
  // getFullReward,
  // makeBotPlay,
  useExecutableForAnswer
}
