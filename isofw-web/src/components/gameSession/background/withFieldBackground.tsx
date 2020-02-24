
import { GAMEFIELD_MAX_WIDTH } from "isofw-shared/src/gameLogic/globals"
import { calculateBlockSize } from "isofw-web/src/components/game/pureField"
import FieldBackground from "isofw-web/src/components/gameSession/background/fieldBackground"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react-lite"
import * as React from "react"
import AutosizeOr from "react-virtualized-auto-sizer"
import "./withFieldBackground.sass"

export interface IWithFieldBackground {
  buttonStyle: any
  width: number
  height: number
  buttonWidth: number
  fieldWidth: number
}

const sizeProps = observable({width: 300, height: 300})

const ContentRenderer: any = observer((props: any) => {
  const width = sizeProps.width
  const height = sizeProps.height
  const fieldWidth = calculateBlockSize(width, height) * (GAMEFIELD_MAX_WIDTH + 1)
  const windowSize = get(global, "window.innerWidth", fieldWidth)
  const buttonWidth = Math.max(fieldWidth,
      fieldWidth + Math.min((windowSize - fieldWidth - 20), fieldWidth / 3))
  const buttonStyle = {width: buttonWidth}
  const itemProps = {width, height, fieldWidth, buttonWidth, buttonStyle}
  return (
      <props.contentComponent {...itemProps} />
  )
})

const WithFieldBackground: React.FunctionComponent<{
  contentComponent: React.FunctionComponent<IWithFieldBackground>
}> = (props) => {
  return (
    <>
      <div className="background">
        <AutosizeOr>
          {({width, height}: any) => {
            sizeProps.width = width
            sizeProps.height = height
            return <FieldBackground width={width} height={height} />
          }}
        </AutosizeOr>
      </div>
      <div className="backgroundOverlay">
        <div className="backgroundOverlayContent">
          <ContentRenderer {...props} />
        </div>
      </div>
    </>
  )
}

export default WithFieldBackground
