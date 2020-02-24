import { random, randomInRange } from "isofw-shared/src/util"
random.setSeed(420)

import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameScore } from "isofw-shared/src/gameLogic/gameScore"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"

describe("The GameScore", () => {
  it("needs some functions to be called for maximum coverage", () => {
    const gameField = new GameField(["a", "b"])
    while (!gameField.gameOver) {
      gameField.placeBlockUsingPlay(randomInRange(0, gameField.getPossiblePlays().length))
    }
    const score = new GameScore(gameField)
    expect(score.getScoreForPlayer("a")).toMatchSnapshot("player a score")
    expect(score.getScoreForPlayerAtIndex(1)).toMatchSnapshot("player b score")
    expect(gameFieldToString(gameField)).toMatchSnapshot("gamefield snapshot")
  })
  it("an unknown tetromino returns null", () => {
    expect(new Tetromino(1, 99, {x: 1, y: 2}).getTranslatedBlock()).toBe(undefined)
  })
})
