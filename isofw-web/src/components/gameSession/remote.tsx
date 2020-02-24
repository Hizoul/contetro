import remoteFieldHook from "isofw-shared/src/components/gameFieldProvider/remote"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { ExpertHelp, ExpertHelpBtn, showExpertHelp } from "../expertData/overlay"
import WebGameFieldDisplay from "../game/field"
import { IGameFieldDisplay } from "../game/pureField"
import {LoadingOverlay} from "../loading"

const WebRemoteGameField: React.FunctionComponent<IGameFieldDisplay & {
  fieldId: string
  showExpertHelpBtn?: boolean
}>  = observer((props) => {
  const remoteProps = remoteFieldHook(props.fieldId, true)
  if (remoteProps.gameField == null && remoteProps.loading === false) {
    return <div>ERROR game field not found</div>
  }
  return (
    <div>
      {showExpertHelp.get() ? <ExpertHelp /> : null}
      {props.showExpertHelpBtn && !showExpertHelp.get() ? <ExpertHelpBtn /> : null}
      {remoteProps.loading ? <LoadingOverlay /> : null}
      {remoteProps.gameField == null ? undefined : <WebGameFieldDisplay {...props} {...remoteProps} />}
    </div>
  )
})

export default WebRemoteGameField
