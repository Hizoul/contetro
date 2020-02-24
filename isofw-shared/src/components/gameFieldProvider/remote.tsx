import { BackendClient, DbStore, toJS } from "@xpfw/data"
import { FormStore, memo } from "@xpfw/form"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import command from "isofw-shared/src/globals/commands"
import { GameSessionForm, LogField, PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"
import { get } from "lodash"
import * as React from "react"
import { GameLog } from "../../gameLogic/gamelog"
import val from "../../globals/val"
import { loadingGameCreate } from "../expertDataCollect"
import { GameFieldProviderHook } from "./shared"

const moveBlockForId = (id: string) => (left?: boolean) => {
  return makeLoadingServerCall(val.service.play, "create", {
    gameId: id,
    commandType: command.moveBlock, commandPayload: left
  }, `${actionKey}${id}`)
}

const makePlayForId = (id: string) =>  () => {
  return makeLoadingServerCall(val.service.play, "create", {
    gameId: id,
    commandType: command.makePlay
  }, `${actionKey}${id}`)
}

const placeUsingPlayForId = (id: string) =>  (play_index: number) => {
  return makeLoadingServerCall(val.service.play, "create", {
    gameId: id,
    play_index,
    commandType: command.placeUsingPlay
  }, `${actionKey}${id}`)
}

const rotateForId = (id: string) =>   (left?: boolean) => {
  return makeLoadingServerCall(val.service.play, "create", {
    gameId: id,
    commandType: command.rotateBlock, commandPayload: left
  }, `${actionKey}${id}`)
}

const switchBlockForId = (id: string) =>   (left?: boolean) => {
  return makeLoadingServerCall(val.service.play, "create", {
    gameId: id,
    commandType: command.changeBlock, commandPayload: left
  }, `${actionKey}${id}`)
}

const remoteFieldHook: GameFieldProviderHook = (id: string = "local", deterministic: boolean = true) => {
  let gameField: any
  const game: any = DbStore.getGetState(id, val.service.gameSession, true)
  if (game != null) {
    let gameLog: any
    const remoteLog = get(game, `${LogField.title}`, [])
    if (remoteLog.length > 0) {
      gameLog = new GameLog()
      gameLog.log = remoteLog
    }
    // TODO: currently server has log.log instead of just log as array
    gameField = new GameField(game[String (PlayersField.title)], gameLog, deterministic)
  }
  return {
    gameField,
    game,
    moveBlock: memo(() => moveBlockForId(id), ["move", id]),
    makePlay: memo(() => makePlayForId(id), ["play", id]),
    placeUsingPlay: memo(() => placeUsingPlayForId(id), ["rplaceUsingPlayForId", id]),
    rotate: memo(() => rotateForId(id), ["rotate", id]),
    switchBlock: memo(() => switchBlockForId(id), ["switchBlock", id]),
    loading: FormStore.getLoading(id) ||
      FormStore.getLoading(val.service.play) ||
      FormStore.getLoading(`${actionKey}${id}`)
  }
}

const actionKey = "action"

const makeLoadingServerCall = async (collection: string, method: string, data: any, loadingKey: string) => {
  if (FormStore.getLoading(loadingKey) !== true) {
    try {
      FormStore.setLoading(loadingKey, true)
      loadingGameCreate.set(true)
      const callFunc = get(BackendClient, `client.${method}`)
      const res = await callFunc(collection, data)
      console.log("SETTING GAME TO", res)
      DbStore.setItem(data.gameId, val.service.gameSession, res)
      FormStore.setLoading(loadingKey, false)
      loadingGameCreate.set(false)
      return res
    } catch (e) {
      FormStore.setLoading(loadingKey, false)
    }
  }
}

export default remoteFieldHook
