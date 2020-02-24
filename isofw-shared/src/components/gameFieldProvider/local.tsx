import { memo } from "@xpfw/form"
import LocalFieldStore from "isofw-shared/src/store/localField"
import { jsToRustLog } from "../../util/rustLogParser"
import { GameFieldProviderHook } from "./shared"

const moveBlockForId = (id: string) => (left?: boolean) => {
  const newField = LocalFieldStore.getField(id)
  if (newField != null) {
    newField.moveBlock(left)
    LocalFieldStore.setField(id, newField.clone())
  }
}

const makePlayForId = (id: string) =>  async () => {
  const newField = LocalFieldStore.getField(id)
  if (newField != null) {
    await newField.placeBlockUsingPlay(newField.log.getCurrentPlay())
    LocalFieldStore.setField(id, newField.clone())
  }
}
const placeUsingPlayForId = (id: string) =>  async (play: number) => {
  const newField = LocalFieldStore.getField(id)
  if (newField != null) {
    await newField.placeBlockUsingPlay(play)
    LocalFieldStore.setField(id, newField.clone())
  }
}
const rotateForId = (id: string) =>   (left?: boolean) => {
  const newField = LocalFieldStore.getField(id)
  if (newField != null) {
    newField.rotateBlock(left)
    LocalFieldStore.setField(id, newField.clone())
  }
}
const switchBlockForId = (id: string) =>   (left?: boolean) => {
  const newField = LocalFieldStore.getField(id)
  if (newField != null) {
    newField.switchBlock(left)
    LocalFieldStore.setField(id, newField.clone())
  }
}

const localFieldHook: GameFieldProviderHook = (id: string = "local") => {
  return {
    gameField: LocalFieldStore.getField(id),
    game: {},
    moveBlock: memo(() => moveBlockForId(id), ["lmoveBlock", id]),
    makePlay: memo(() => makePlayForId(id), ["lmakePlay", id]),
    placeUsingPlay: memo(() => placeUsingPlayForId(id), ["placeUsingPlayForId", id]),
    rotate: memo(() => rotateForId(id), ["lrotate", id]),
    switchBlock: memo(() => switchBlockForId(id), ["lswitchBlock", id]),
    loading: false
  }
}

export default localFieldHook
