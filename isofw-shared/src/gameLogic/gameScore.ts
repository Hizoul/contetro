import { GameField } from "./gameField"
import { Tetromino } from "./tetromino"

export class GameScore {
  public gameField: GameField
  constructor(gameField: GameField) {
    this.gameField = gameField
  }

  public getScoreForPlayerAtIndex(index: number) {
    return this.getScoreForPlayer(this.gameField.players[index])
  }

  public getScoreForPlayer(player: string) {
    let score = 0
    const playerBlocks = this.gameField.log.getBlocksPerPlayer(this.gameField)
    let i = 0
    playerBlocks[player].forEach((block) => {
      playerBlocks[player].forEach((compareBlock) =>
      block.getTranslatedBlock().map((part) => compareBlock.getTranslatedBlock().map((comparePart) => {
        if (part.x === comparePart.x + 1 && part.y === comparePart.y ||
          part.x === comparePart.x - 1 && part.y === comparePart.y ||
          (part.x === comparePart.x) &&
          (part.y === comparePart.y - 1 || part.y === comparePart.y + 1)) {
          return playerBlocks[player][i].addTouchingBlock(compareBlock)
        }
      })))
      i++
    })
    const alreadyCounted: Tetromino[] = []
    playerBlocks[player].forEach((block) => {
      if (alreadyCounted.indexOf(block) === -1 &&
        block.touchingBlocks.length > 0) {
          const connected = block.getConnectedBlocks()
          if (connected.length >= 3) {
            connected.forEach((conblock) => alreadyCounted.push(conblock))
            score += connected.length
          }
      }
    })
    const allPositions = this.gameField.gatherAllPositions()
    playerBlocks[player].forEach((block) => {
      let maxSub = 0
      block.getTranslatedBlock().map((part) => {
        let highestY = 0
        let foundPart = false
        allPositions.forEach((comparePart) => {
          if ((part.x === comparePart.x && comparePart.y < part.y) && highestY <= comparePart.y) {
            foundPart = true
            highestY = comparePart.y + 1
          }
        })
        if (highestY > 0 || !foundPart) {
          maxSub += highestY - part.y
        }
      })
      if (maxSub < -2) { // TODO: make configurable
        maxSub = -2
      }
      score += maxSub
    })
    return score
  }
  public getWinner() {
    let players = this.gameField.players
    let maxScore = -99
    let isDraw = false
    let winner = null
    for (let player of players) {
      let playerScore = this.getScoreForPlayer(player)
      if (maxScore < playerScore) {
        isDraw = false
        winner = player
        maxScore = playerScore
      } else if (maxScore == playerScore) {
        isDraw = true
        winner = null
      }
    }
    return {
      maxScore, winner, isDraw
    }
  }
}
