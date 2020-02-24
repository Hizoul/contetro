import { Cipher } from "crypto"
import { lchown, lstat } from "fs"
import makeApp from "isofw-node/src/app"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"
import { get, isObject, isString } from "lodash"
import { MongoClient } from "mongodb"

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

const idToName: any = {}
const perGroup: any = {}
const groupList = ["author", "beginner", "expert", "known"]
const groups: any = {
  "5dcd842b41a28eaba8fa8417": "author",
  "5dcd84ff41a28e7050fa8418": "expert",
  "5dcd850641a28e478afa8419": "expert",
  "5dcd850c41a28eeb16fa841a": "expert",
  "5dcd851241a28e85dbfa841b": "known",
  "5dcd851941a28e4b94fa841c": "known",
  "5dcd852541a28e14f1fa841e": "known",
  "5dcd851f41a28e98c1fa841d": "known",
  "5dcd84ff41a28e7050fa841f": "known",
  "5de15496a84fe31d489e69e3": "known",
  "5dd3d282e8186f1f83c69084": "known",
  "5dcd852b41a28e273dfa841f": "known",
  "5dd3d28ce8186fa07cc69085": "beginner",
  "5dd3d2a4e8186f7fdcc69086": "beginner",
  "5dd3d2dbe8186f4e88c69087": "beginner"
}
for (const group of groupList) {
  perGroup[group] = {draws: 0, wins: 0, minScore: 25, maxScore: -25, total: 0, wonBy: [], score: 0}
}
const doStuff = async () => {
  const c = await MongoClient.connect(mongoUrl, {useNewUrlParser: true})
  const db = c.db("contetro")
  console.log("extracting data")
  const col = db.collection("gameSession")
  const users = db.collection("users")
  const perPlayer: any = {}
  await users.find().forEach((user) => {
    console.log("user is", user._id.toHexString())
    idToName[user._id.toHexString()] = user.email
    perPlayer[user._id.toHexString()] = {
      draws: 0, wins: 0, minScore: 25, maxScore: -25, total: 0, wonBy: []
    }
  })
  const dataPerUser = {}
  const fullData: any[] = []
  const wonBy: any[] = []
  const wonByRandom: any[] = []
  const wonBySet: any[] = []
  const expertData = []
  const regularPeople = []
  let playerWins = 0
  let winsRandom = 0
  let winsSet = 0
  let totalRandom = 0
  let totalSet = 0
  let sta = 0
  let stp = 0
  let minsp = 25
  let maxsp = -25
  let minsa = 25
  let maxsa = -25
  let draws = 0
  let drawSet = 0
  let drawRandom = 0
  let scoreSet = 0
  const playerPoints = 0
  let scoreRandom = 0
  await col.find().forEach((item) => {
    if (item.gameOver) {
      const player = item.players[0]
      const group = groups[player]
      console.log("PLAYER IS", player, typeof(player), group)
      const field = fromLog(item.players, item.log)
      const score = field.getScores()
      const aiWon = score[1] > score[0]
      if (perGroup[group] != null) {
        perGroup[group].total += 1
      } else {
        console.log("UNKNOWN GROUP FOR", player, group, groups[player])
      }
      perPlayer[player].total += 1
      perGroup[group].score += score[0]
      if (aiWon === false) {
        perPlayer[player].wins += 1
        if (perGroup[group] == null) {
          console.log("MISSING GROUP", player)
        } else {
          perGroup[group].wins += 1
        }
      }
      const draw = score[1] === score[0]
      sta += score[1]
      stp += score[0]
      if (score[0] > maxsp) {
        maxsp = score[0]
        perPlayer[player].maxScore = score[0]
      }
      if (score[0] < minsp) {
        minsp = score[0]
        perPlayer[player].minScore = score[0]
      }
      if (score[1] > maxsa) {maxsa = score[1]}
      if (score[1] < minsa) {minsa = score[1]}
      const wasRandom = item.players[1] === "bot_random"
      if (wasRandom) {
        scoreRandom += score[1]
      } else {
        scoreSet += score[1]
      }
      if (draw) {
        perPlayer[player].draws += 1
        perGroup[group].draws += 1
        draws += 1
        if (wasRandom) {
          drawRandom += 1
        } else {
          drawSet += 1
        }
      } else {
      }
      fullData.push({
        player,
        aiWon,
        score,
        wasRandom
      })
      if (wasRandom) {
        totalRandom += 1
      } else {
        totalSet += 1
      }
      if (aiWon === false) {
        playerWins += 1
        wonBy.push(Math.abs(score[0] - score[1]))
        perPlayer[player].wonBy.push(Math.abs(score[0] - score[1]))
        perGroup[group].wonBy.push(Math.abs(score[0] - score[1]))
      } else {
        if (wasRandom) {
          wonByRandom.push(Math.abs(score[0] - score[1]))
        } else {
          wonBySet.push(Math.abs(score[0] - score[1]))
        }
        if (wasRandom) {
          winsRandom += 1
        } else {
          winsSet += 1
        }
      }
    }
  })
  for (const player of Object.keys(perPlayer)) {
    perPlayer[player].wonbyavg = average(perPlayer[player].wonBy)
    perPlayer[player].winRate = perPlayer[player].wins / perPlayer[player].total
  }
  for (const gr of groupList) {
    perGroup[gr].wonbyavg = average(perGroup[gr].wonBy)
    perGroup[gr].winRate = perGroup[gr].wins / perGroup[gr].total
    perGroup[gr].avgScore = perGroup[gr].score / perGroup[gr].total
  }
  c.close()
  const matchAmount = fullData.length
  console.log("FULL DATA IS", fullData, fullData.length)
  console.log("win ratio", playerWins / fullData.length, playerWins, fullData.length, "averagewonby ", average(wonBy))
  console.log(`score average player:${stp / matchAmount} ai:${sta / matchAmount}; draws total: ${draws}`)
  console.log(`player: ${minsp};${maxsp} ai: ${minsa};${maxsa}`)
  console.log(`for random: wins: ${winsRandom} / draws: ${drawRandom} / total: ${totalRandom}=${winsRandom / totalRandom} / wonBy: ${average(wonByRandom)} / avgscore: ${scoreRandom / totalRandom}`)
  console.log(`for set: wins: ${winsSet} / draws: ${drawSet} / total: ${totalSet}=${winsSet / totalSet} / wonBy: ${average(wonBySet)} / avgscore: ${scoreSet / totalSet}`)
  console.log("PERPLAYER", perPlayer, Object.keys(perPlayer).length)
  console.log("pergroup", perGroup)
}
doStuff()
