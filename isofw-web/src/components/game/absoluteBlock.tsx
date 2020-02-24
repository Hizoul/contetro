import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GAMEFIELD_MAX_HEIGHT, GAMEFIELD_MAX_WIDTH } from "isofw-shared/src/gameLogic/globals"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import { range } from "isofw-shared/src/util"
import * as React from "react"
import pose from "react-pose"
import { IBlockDisplay } from "./block"

const WebBlockDisplay: React.FunctionComponent<IBlockDisplay> =
(props) => {
  const backgroundColor = props.gameField ?
    props.gameField.getPlayerColor(props.tetromino.from) : props.color
  const parts = props.tetromino.getBlock()
  const renderedParts = parts.map((part) => {
    const pos = {
      left: Math.ceil(props.size * part.x),
      bottom: Math.ceil(props.size * part.y),
      backgroundColor, minWidth: props.size, minHeight: props.size
    }
    return (
      <div
        className="block"
        style={pos}
        key={`${part.x}x${part.y}`}
      />
    )
  })
  const RenderedBlock = (
    <div
      className={`tetromino${props.isHoverBlock ? " hoverBlock" : ""}`}
      style={{
        backgroundColor: "transparent",
        minWidth: props.size,
        minHeight: props.size
      }}
    >
      {renderedParts}
    </div>
  )
  return RenderedBlock
}

export default WebBlockDisplay
