import { random, randomInRange } from "isofw-shared/src/util"
random.setSeed(532)

import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"

const playerList2 = ["a", "b"]
const playerList4 = ["a", "b", "c", "d"]

/*
28 never playable indices!
invalid i positions (3)
  - 14, 16, 18 (look too far over on the right hence NEVER fits)
invalid o positions:
  - 29 (look to far over on the right hence NEVER fits)
invalid t positions:
  - 30, 32, 33 (looks to far over on the left hence NEVER fits)
  - 66, 67, 68 (looks to far over on the left hence NEVER fits same as on left)
invalid s positions:
  - 72, 76 (looks to far over on the left hence NEVER fits)
  - 102, 106, 107, 109 (looks to far over on the right hence NEVER fits)
invalid l positions:
  - 174, 176, 178, 180, 182, 183, 184, 185, 186, 187, 188, 189,
*/

describe("The possiblePlays algorithm", () => {
  it("has invalid turns", () => {
    const gameField = new GameField(playerList2, undefined, true)
    const invalidPlays = gameField.getPossiblePlays(true)
    console.log("LENGTH IS", invalidPlays.length)
    for (const play of invalidPlays) {
      const clone = gameField.clone()
      const blockType = play.block
      const y = clone.getHighestY(play.x, new Tetromino(blockType, play.rotation, {
        x: play.x,
        y: 0
      }))
      const block = new Tetromino(blockType, play.rotation, {
        x: play.x,
        y
      })
      block.from = clone.log.getCurrentPlayer()

      clone.blocks.push(block)
      clone.blockRestrictions[clone.log.getCurrentPlayer()][block.type]--
      clone.log.blockPlaced(clone.log.getCurrentPlayer(),
      block.type, block.rotation, block.position.x, block.position.y)
      clone.determineNextPlayer()
    }
  })
})
