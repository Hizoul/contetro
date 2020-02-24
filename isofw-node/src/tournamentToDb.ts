import { Cipher } from "crypto"
import { readFileSync } from "fs"
import makeApp from "isofw-node/src/app"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"
import { get, isObject, isString } from "lodash"
import { MongoClient } from "mongodb"
import { rustToJsLog } from "../../isofw-shared/src/util/rustLogParser"

let mongoUrl: any = `mongodb://localhost:27017/`

if (isObject(global.process) && isString(process.env.MONGO_URL)) {
  mongoUrl = process.env.MONGO_URL
  console.log(`MongoURL overwritten to ${mongoUrl}`)
}
console.log("Attempting to connect to database")

const fromLog = (players: any, remoteLog: any) => {
  let gameLog: any
  if (remoteLog.length > 0) {
    gameLog = new GameLog()
    gameLog.log = remoteLog
  }
  return new GameField(players, gameLog, true)

}

const average = (data: any[]) => {
  const total = data.length
  let sum = 0
  for (const d of data) {
    sum += d
  }
  return sum / total
}

const convertStuff = async () => {
  const c = await MongoClient.connect(mongoUrl, {useNewUrlParser: true})
  const db = c.db("contetroo")
  const gameSessions = db.collection("gameSession")
  const tournament = JSON.parse(readFileSync("final_tournament.json", "UTF-8"))
  let i = 0
  for (const entry of tournament) {
    console.log(`at ${i} / ${tournament.length}`)
    i += 1
    const convertedLog = rustToJsLog(JSON.stringify({log: entry.log}), entry.players)
    await gameSessions.insert({
      log: convertedLog.log,
      players: entry.players,
      gameOver: true
    })
  }
  await c.close()
}

const doStuff = async () => {
  const c = await MongoClient.connect(mongoUrl, {useNewUrlParser: true})
  const db = c.db("contetroo")
  console.log("extracting data")
  const col = db.collection("gameSession")
  const users = db.collection("users")
  const perPlayer: any = {}
  for (const email of ["python_0", "python_1", "python_2", "python_3", "python_4", "python_5", "python_6", "python_7", "python_8", "python_9", "Random Heuristic", "Tuned Heuristic", "User Heuristic", "MCTS-UCB", "MCTS-RAVE", "MCTS-PoolRAVE"]) {
    perPlayer[email] = {
      draws: 0, wins: 0, minScore: 25, maxScore: -25, total: 0, wonBy: [], totalScore: 0,
      maxId: null, minId: null, timesMaxScore: 0, timesMinScore: 0, belowMinusFive: 0
    }
  }
  await col.find().forEach((item) => {
    if (item.gameOver) {
      const field = fromLog(item.players, item.log)
      const score = field.getScores()
      for (let i = 0; i < 2; i++) {
        const other = i === 0 ? 1 : 0
        const player = item.players[i]
        perPlayer[player].total += 1
        if (score[i] > score[other]) {
          perPlayer[player].wins += 1
          perPlayer[player].totalScore += score[i]
          perPlayer[player].wonBy.push(Math.abs(score[i] - score[other]))
        }
        if (score[i] > perPlayer[player].maxScore) {
          perPlayer[player].maxScore = score[i]
          perPlayer[player].maxId = item._id
          perPlayer[player].timesMaxScore = 1
        } else if (score[i] === perPlayer[player].maxScore) {
          perPlayer[player].timesMaxScore += 1
        }
        if (score[i] < perPlayer[player].minScore) {
          perPlayer[player].minScore = score[i]
          perPlayer[player].minId = item._id
          perPlayer[player].timesMinScore = 1
        } else if (score[i] === perPlayer[player].minScore) {
          perPlayer[player].timesMinScore += 1
        }
        if (score[i] <= 0) {
          perPlayer[player].belowMinusFive += 1
        }
        const draw = score[1] === score[0]
        if (draw) {
          perPlayer[player].draws += 1
        }
      }
    }
  })
  for (const player of Object.keys(perPlayer)) {
    perPlayer[player].wonbyavg = average(perPlayer[player].wonBy)
    perPlayer[player].scoreAvg = perPlayer[player].totalScore / perPlayer[player].total
    perPlayer[player].winRate = perPlayer[player].wins / perPlayer[player].total
    delete perPlayer[player].wonBy
  }
  console.log("PER PLAYER IS", perPlayer)
  for (const player of Object.keys(perPlayer)) {
    console.log(`link for ${player} highest http://localhost:4201/#/online/history/${perPlayer[player].maxId} and lowest http://localhost:4201/#/online/history/${perPlayer[player].minId}`)
  }
  c.close()
}
doStuff()
// load("heu"),
// load("self-0"),
// load("self-2"),
// load("self-0-heu"),
// load("self-2-heu"),
// load("self-nobleed-2"),
// load("self-nobleed-5"),
// load("self-nobleed-2-heu"),
// load("self-nobleed-5-heu"),
