import { random, randomInRange } from "isofw-shared/src/util"
random.setSeed(420)

import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameScore } from "isofw-shared/src/gameLogic/gameScore"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"

describe("The speed", () => {
  it("bench", () => {
    const start = performance.now()
    const gameField = new GameField(["a", "b"])
    gameField.deterministic_mode = true
    while (!gameField.gameOver) {
      gameField.placeBlockUsingPlay(0)
    }
    const score = new GameScore(gameField)
    const s1 = score.getScoreForPlayerAtIndex(0)
    const s2 = score.getScoreForPlayerAtIndex(1)
    const end = performance.now()
    console.log("took", end - start)
  })
})
