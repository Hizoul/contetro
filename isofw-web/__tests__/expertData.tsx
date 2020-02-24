import { BackendClient, DbStore, MailField, PwField, UserStore } from "@xpfw/data"
import FeathersClient from "@xpfw/data-feathers"
import getRandomApp from "isofw-node/src/testUtil/getRandomApp"
import remoteFieldHook from "isofw-shared/src/components/gameFieldProvider/remote"
import val from "isofw-shared/src/globals/val"
import renderSnapshot from "isofw-shared/src/testUtil/renderSnapshot"
import { randomInRange } from "isofw-shared/src/util"
import promiseTimeout from "isofw-shared/src/util/promiseTimeout"
import WebExpertDataCollector from "isofw-web/src/components/expertData"
import * as React from "react"
import useExpertDataCollector from "../../isofw-shared/src/components/expertDataCollect"

BackendClient.client = FeathersClient
const testName = "TESTUSER"
const testPw = "testpw"
test("expertData", async () => {
  const rApp = await getRandomApp(BackendClient.client)
  try {
    await promiseTimeout(400)
    const user = await rApp.app.service(val.service.user).create({
      [String(MailField.title)]: testName,
      [String(PwField.title)]: testPw
    })
    const userId = user._id.toHexString()
    await DbStore.getFromServer(userId, val.service.user)
    renderSnapshot(<WebExpertDataCollector userName={testName} pw={testPw} />,
      "After connected but need login")
    renderSnapshot(<WebExpertDataCollector userName={testName} pw={testPw} />,
      "After connected during login")
    while (UserStore.user == null) {
      await promiseTimeout(400)
    }
    renderSnapshot(<WebExpertDataCollector userName={testName} pw={testPw} />,
      "After connected and logged in")
    console.log("USER IS ", UserStore.user)
    await DbStore.getFromServer("_" + userId, val.service.expertData)
    const expert = useExpertDataCollector(testName, testPw)
    await expert.startPlay()
    const gameId = await DbStore.getFromServer("_" + userId, val.service.expertData)
    await DbStore.getFromServer(gameId, val.service.gameSession)
    renderSnapshot(<WebExpertDataCollector userName={testName} />,
      "After fetched active game")
    let gameOver = false
    console.log("GAME ID IS", gameId)
    let remoteHelper = remoteFieldHook(gameId)
    while (!gameOver) {
      console.log("CALLING PLACE BLOCK")
      await remoteHelper.placeUsingPlay(0)
      remoteHelper = remoteFieldHook(gameId)
      gameOver = remoteHelper.game.gameOver
      // doesn*t end yet
    }
    console.log("ACHIEVED REWARD IS", remoteHelper.game.reward)
    expect(remoteHelper.game.reward !== -1).toBe(true)
  } catch (e) {
    console.log("CAUGHT E", e)
  }
  await rApp.cleanUp()
}, 60000)
