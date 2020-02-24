import { IGameFieldProviderProps } from "isofw-shared/src/components/gameFieldProvider/shared"
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GAMEFIELD_MAX_HEIGHT, GAMEFIELD_MAX_WIDTH } from "isofw-shared/src/gameLogic/globals"
import * as React from "react"
import WebBlockDisplay from "./block"
import "./style.sass"

export interface IGameFieldDisplay {
  width: number
  height: number
  noBg?: boolean
}

const calculateBlockSize = (fieldWidth: number, fieldHeight: number) => {
  const width: number = fieldWidth / GAMEFIELD_MAX_WIDTH
  const height: number = fieldHeight / GAMEFIELD_MAX_HEIGHT
  return Math.floor(Math.min(width, height))
}
const calculateOffset = (blockSize: number, width: number, height: number) => {
  return Math.max(0, (width / 2) - ((blockSize * GAMEFIELD_MAX_WIDTH) / 2))
}

const PureField: React.FunctionComponent<IGameFieldDisplay & {
  gameField: GameField
  hideHover?: boolean
}> = (props) => {
  if (props.gameField == null) {
    return <div />
  }
  const blockSize = calculateBlockSize(props.width, props.height)
  const offset = calculateOffset(blockSize, props.width, props.height)
  const positions = props.gameField.blocks.map((block) => (
    <WebBlockDisplay
      {...props}
      key={`${block.position.x}$x${block.position.y}`}
      tetromino={block}
      size={blockSize}
      offset={offset}
      width={props.width}
    />
  ))
  const hoverBlock = props.gameField.getHoverBlock()
  if (props.hideHover !== true && hoverBlock != null) {
    positions.push(
      <WebBlockDisplay
        {...props}
        key={`${hoverBlock.position.x}$x${hoverBlock.position.y}`}
        tetromino={hoverBlock}
        size={blockSize}
        offset={offset}
        width={props.width}
        isHoverBlock={true}
      />
      )
  }
  const fieldSize = blockSize * GAMEFIELD_MAX_WIDTH
  return (
    <div
      className={props.noBg ? undefined : "gameFieldContainer"}
      style={{minWidth: props.width, minHeight: props.height}}
    >
      {props.noBg ? undefined : (
        <>
          <div className="line" style={{height: props.height, left: offset}} />
          <div className="line" style={{height: props.height, left: (offset + fieldSize)}} />
          <div style={{position: "absolute", backgroundColor: "white", height: props.height, width: fieldSize, left: offset}} />
        </>
      )}{positions}
    </div>
  )
}

export default PureField
export {
  calculateBlockSize, calculateOffset
}
