import { random, randomInRange } from "isofw-shared/src/util"
random.setSeed(532)

import { GameField } from "isofw-shared/src/gameLogic/gameField"
import gameFieldToString from "isofw-shared/src/util/gameFieldToString"

const playerList2 = ["a", "b"]
const playerList4 = ["a", "b", "c", "d"]

describe("The GameField", () => {
  it("block unavailable", () => {
    const gameField = new GameField(playerList4)
    gameField.blockRestrictions.a = [0, 0, 0, 0, 0, 0]
    gameField.blockRestrictions.b = [0, 0, 0, 0, 0, 0]
    gameField.placeBlockUsingPlay(0)
    gameField.setCurrentPlay(2)
    expect(gameField.placeCurrentBlock()).toBe(true)
    expect(gameField.log).toMatchSnapshot("Skipped because block unavailable")
  })
  it("should initialize a player on startup", () => {
    const gameField = new GameField(playerList2)
    // block was rolled
    expect(gameField.log.log.length).toBe(2)
    // there is a current lpayer
    expect(gameField.log.getCurrentPlayer).not.toBeNull()
    expect(gameField).toMatchSnapshot("After Init")
    expect(gameField.getPossiblePlays()).toMatchSnapshot("there should be plays available")
    gameField.placeBlockUsingPlay(2)
    expect(gameField).toMatchSnapshot("after placing block")
    gameField.setCurrentPlay(0)
    const fieldBeforeMove = gameFieldToString(gameField)
    gameField.moveBlock()
    gameField.moveBlock()
    expect(gameField).toMatchSnapshot("moved block to the right")
    gameField.rotateBlock()
    expect(gameField).toMatchSnapshot("rotated block")
    gameField.rotateBlock(true)
    expect(gameField).toMatchSnapshot("rotated back")
    gameField.moveBlock(true)
    gameField.moveBlock(true)
    expect(gameField).toMatchSnapshot("moved back")
    gameField.playerColors = {a: "blue", b: "red"}
    expect(gameField.getPlayerColor("a")).toBe("blue")
    expect(gameField.getPlayerColor("UNKNOWN")).toBe("#000")
    expect(fieldBeforeMove).toBe(gameFieldToString(gameField))
  })
  it("game should end at some point", () => {
    const gameField = new GameField(playerList4)
    expect(gameField).toMatchSnapshot("empty Game")
    let lastBlock: any
    while (!gameField.gameOver) {
      lastBlock = gameField.getHoverBlock()
      gameField.placeBlockUsingPlay(randomInRange(0, gameField.getPossiblePlays().length))
    }
    expect(gameField).toMatchSnapshot("finished Game")
    expect(gameFieldToString(gameField)).toMatchSnapshot("visualized FIeld")
    expect(gameField.placeCurrentBlock()).toBe(false)
    expect(gameField.placeBlock(lastBlock)).toBe(false)
    expect(gameField.placeBlockUsingPlay(99)).toBe(false)
    const bla: any = null
    expect(gameField.canPlaceBlock(bla)).toBe(false)
    expect(gameField.getHoverBlock()).toBe(null)
    const gameFieldCopy = gameField.clone()
    expect(gameFieldToString(gameField)).toBe(gameFieldToString(gameFieldCopy))
    const playerBlocks = gameField.log.getBlocksPerPlayer(gameField)
    expect(playerBlocks).toMatchSnapshot("player blocks")
    expect(playerBlocks.a[0].getConnectedBlocks()).toMatchSnapshot("connected blocks")
  })
})
