import { AuthForm, BackendClient, DbStore, MailField, PwField, toJS, useAuth, useGet } from "@xpfw/data"
import { FormStore, memo } from "@xpfw/form"
import val from "isofw-shared/src/globals/val"
import { observable } from "mobx"

const ud: any = DbStore
const loadingGameCreate = observable.box(false)
const createNewBotGame = (userId: string) => {
  return memo(() => {
    return async () => {
      console.log("ABOUT TO SAART NEW GAME", userId)
      loadingGameCreate.set(true)
      const answerRes = await BackendClient.client.patch(val.service.expertData, userId, {})
      console.log("PATCH ANSWER IS", answerRes)
      delete ud.lastFetch["_" + userId]
      const finres = await DbStore.getFromServer("_" + userId, val.service.expertData)
      console.log("NASWER OF NEXT FIND", finres)
      loadingGameCreate.set(false)
    }
  } , ["createNewBotGame", userId])
}

const useExpertDataCollector = (name: any, pw: any) => {
  let reward = -1
  let loading = loadingGameCreate.get()
  const auth = useAuth()
  if (!auth.loggedIn && auth.loading === false && auth.error == null) {
    console.log("SUBMITTING NEW LOGIN")
    FormStore.setValue(MailField.title, name, AuthForm.title)
    FormStore.setValue(PwField.title, pw, AuthForm.title)
    auth.submitLogin().then((a) => console.log("LOGIN ANSWER IS", a))
  }
  if (auth.user == null) {
    return {gameProps: {}, auth, hasActiveGame: false, startPlay: () => {}}
  }
  console.log("GETTING GAME FOR", "_" + auth.user._id)
  const gameProps = useGet("_" + auth.user._id, val.service.expertData)
  if (gameProps.loading) {loading = true}
  let hasActiveGame = gameProps.item != null && gameProps.item !== -1
  let gameId: any
  console.log("GAMEPROPS ARE", toJS(gameProps.item))
  if (hasActiveGame) {
    gameId = gameProps.item
    const gameData = useGet(gameId, val.service.gameSession)
    if (gameData.loading) {loading = true}
    console.log("CHECKING GAME OVER FOR", toJS(gameData.item))
    if (gameData.item != null && gameData.item.gameOver === true) {
      hasActiveGame = false
      reward = gameData.item.reward
      console.log("DECLARING IT GAME OVER")
    }
  }
  return {
    gameProps, hasActiveGame, reward, gameId, auth,
    loading,
    startPlay: createNewBotGame(auth.user._id)
  }
}

export default useExpertDataCollector
export {
  loadingGameCreate
}
