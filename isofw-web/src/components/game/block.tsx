import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GAMEFIELD_MAX_HEIGHT, GAMEFIELD_MAX_WIDTH, LOCAL_COLORS } from "isofw-shared/src/gameLogic/globals"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import val from "isofw-shared/src/globals/val"
import { range } from "isofw-shared/src/util"
import * as React from "react"
import pose from "react-pose"

export interface IBlockDisplay {
  tetromino: Tetromino
  gameField?: GameField
  color?: string
  size: number
  offset: number
  width: number
  isHoverBlock?: boolean
  initialPose?: string
}

const createBoxAnimationPoses = (width: number, size: number, offset: number) => {
  const poses: any = {
    hoverable: true,
    init: {scale: 1},
    hover: { scale: 1.4 }
  }
  for (const x of range(0, GAMEFIELD_MAX_WIDTH)) {
    for (const y of range(0, GAMEFIELD_MAX_HEIGHT)) {
      const distance = {
        left: `${(x * size) + offset}px`,
        bottom: `${y * size}px`,
        transition: {
          type: "tween", ease: "circIn", duration: val.animationTime
        }
      }
      poses[`${width}${x}x${y}${offset}`] = distance
    }
  }
  return poses
}
const middleCircleMargin = 3
const middleCircleRemove = middleCircleMargin * 2
const posses: any = {}
const getPositionerForSize = (width: number, size: number, offset: number) => {
  const objKey = `${size}`
  if (posses[objKey] == null) {
    posses[objKey] = pose.div(createBoxAnimationPoses(width, size, offset))
  }
  return posses[objKey]
}

const WebBlockDisplay: React.FunctionComponent<IBlockDisplay> =
(props) => {
  const BoxPositioner = getPositionerForSize(props.width, props.size, props.offset)
  let backgroundColor = props.gameField ?
    props.gameField.getPlayerColor(props.tetromino.from) : props.color
  if (props.gameField != null && backgroundColor === "#000") {
    const num: any = props.gameField.players.indexOf(props.tetromino.from)
    backgroundColor = LOCAL_COLORS[num]
  }
  const parts = props.tetromino.getBlock()
  let i = 0
  const renderedParts = parts.map((part) => {
    i++
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
      >
        <div className="blockOverlay">&nbsp;</div>
        {i === 1 ? <div className="middleCircle" style={{maxWidth: props.size - middleCircleRemove, maxHeight: props.size - middleCircleRemove, marginLeft: middleCircleMargin, marginTop: middleCircleMargin}}/> : undefined}
      </div>
    )
  })
  const currentPose = `${props.width}${props.tetromino.position.x}x${props.tetromino.position.y}${props.offset}`
  const initialPose = props.initialPose ? props.initialPose :
    `${props.width}${props.tetromino.position.x}x20${props.offset}`
  const RenderedBlock = (
    <BoxPositioner
      className={`tetromino${props.isHoverBlock ? " hoverBlock" : ""}`}
      initialPose={initialPose}
      style={{backgroundColor: "transparent", minWidth: props.size, minHeight: props.size}}
      pose={currentPose}
    >
      {renderedParts}
    </BoxPositioner>
  )
  return RenderedBlock
}

export default WebBlockDisplay
