import { GameField } from "../gameLogic/gameField"
import { GAMEFIELD_MAX_HEIGHT, GAMEFIELD_MAX_WIDTH } from "../gameLogic/globals"
import { isNumber } from "lodash"

const gameFieldToString = (gameField: GameField, includeHover?: boolean) => {
  let gameFieldString = "\n"
  const pointsInField: any[] = []
  for (let height = 0; height < GAMEFIELD_MAX_HEIGHT; height++) {
    pointsInField[height] = []
    for (let width = 0; width < GAMEFIELD_MAX_WIDTH; width++) {
      pointsInField[height][width] = "o"
    }
  }
  for (const block of gameField.blocks) {
    for (const position of block.getTranslatedBlock()) {
      pointsInField[Number(position.y)][Number(position.x)] = isNumber(block.from) ? block.from : gameField.players.indexOf(block.from)
    }
  }
  const hoverBlock = gameField.getHoverBlock()
  if (includeHover && hoverBlock != null) {
    for (const position of hoverBlock.getTranslatedBlock()) {
      pointsInField[position.y][position.x] = "H"
    }
  }
  for (let width = GAMEFIELD_MAX_HEIGHT - 1; width >= 0; width--) {
    let line = ``
    for (let height = 0; height < GAMEFIELD_MAX_WIDTH; height++) {
      line += pointsInField[width][height]
    }
    gameFieldString += `${line}\n`
  }
  return gameFieldString
}

export default gameFieldToString
