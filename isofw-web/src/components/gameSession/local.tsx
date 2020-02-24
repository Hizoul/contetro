import localFieldHook from "isofw-shared/src/components/gameFieldProvider/local"
import remoteFieldHook from "isofw-shared/src/components/gameFieldProvider/remote"
import { observer } from "mobx-react-lite"
import * as React from "react"
import WebGameFieldDisplay from "../game/field"
import PureField, { IGameFieldDisplay } from "../game/pureField"
import LoadingPage from "../loading"

const WebLocalGameField: React.FunctionComponent<IGameFieldDisplay & {fieldId: string}>  = observer((props) => {
  const localProps = localFieldHook(props.fieldId)
  if (localProps.gameField == null && localProps.loading === false) {
    window.location.href = "/"
    return <div>ERROR game field not found</div>
  }
  return (
    <>
      <WebGameFieldDisplay {...props} {...localProps} />
    </>
  )
})

export default WebLocalGameField
