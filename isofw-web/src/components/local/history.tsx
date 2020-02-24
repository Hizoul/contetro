import { toJS, useAuth } from "@xpfw/data"
import fieldHistoryHook from "isofw-shared/src/components/gameFieldProvider/history"
import localFieldHook from "isofw-shared/src/components/gameFieldProvider/local"
import remoteFieldHook from "isofw-shared/src/components/gameFieldProvider/remote"
import { SharedField } from "isofw-shared/src/util/xpfwform"
import "isofw-web/src/components/form"
import "isofw-web/src/customizedBulma.sass"
import { observer } from "mobx-react-lite"
import * as React from "react"
import FieldInfoOverlay from "../game/infoOverlay"
import PureField, { IGameFieldDisplay } from "../game/pureField"

const WebGameHistory: React.FunctionComponent<IGameFieldDisplay & {fieldId: string, isRemote?: boolean}>  = observer((props) => {
  if (props.isRemote === true) {
    const auth = useAuth()
    if (auth.loggedIn !== true) {
      return <span>not logged in yet</span>
    }
  }
  const localProps = props.isRemote === true ? remoteFieldHook(props.fieldId) : localFieldHook(props.fieldId)
  if (localProps.gameField == null || localProps.loading === true) {
    return <div>no field yet</div>
  }
  const localHistory = fieldHistoryHook(localProps.gameField)
  if (localProps.gameField == null && localProps.loading === false || localHistory.history.length < localHistory.index) {
    return <div>ERROR game field not found</div>
  }
  console.log("GOT GAMEFIELD", toJS(localHistory.history[localHistory.index]),  toJS(localHistory.history[localHistory.index].players), localHistory.history[localHistory.index].getScores())
  return (
    <>
      <div>
        <FieldInfoOverlay gameField={localHistory.history[localHistory.index]} />
        <PureField {...props} {...localProps} gameField={localHistory.history[localHistory.index]} />
      </div>
      <SharedField schema={localHistory.indexSchema} />
    </>
  )
})

export default WebGameHistory
