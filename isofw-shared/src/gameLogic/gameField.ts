import { jsToRustLog } from "isofw-shared/src/util/rustLogParser"
import { cloneDeep, findIndex } from "lodash"
import { randomInRange, range } from "../util"
import { GameLog } from "./gamelog"
import { GameScore } from "./gameScore"
import {
  GAMEFIELD_MAX_HEIGHT, GAMEFIELD_MAX_WIDTH, IPosition,
  logType, skipReason, tetromino
} from "./globals"
import { amountRotations } from "./shapes"
import { Tetromino } from "./tetromino"

export interface IPlayer {
  name: string
}
export interface IPlay {
  x: number
  rotation: number
  block: number
  globalIndex: number
}

export class GameField {
  public log: GameLog
  public players: string[]
  public playerColors: {[index: string]: string}
  public blockRestrictions: {[index: string]: number[]}
  public gameOver: boolean
  public blocks: Tetromino[]
  public controlType: {[index: string]: number}
  public deterministic_mode: boolean
  private rollIndex: number
  constructor(players: string[], log?: GameLog, deterministic_mode: boolean = false) {
    this.players = players
    this.playerColors = {}
    this.blocks = []
    this.gameOver = false
    this.deterministic_mode = deterministic_mode
    this.blockRestrictions = {}
    if (log === null || log === undefined) {
      this.log = new GameLog()
      this.initBlockRestrictions()
    } else {
      // required so line 40 is satisfied by ts
      this.log = log
      this.restoreFromLog(log)
    }
    if (this.log.getCurrentPlayer() == null) {
      if (this.deterministic_mode) {
        this.log.rolledBlock(this.players[0], 0)
        this.log.createConsideration()
      } else {
        this.randomNextPlayer()
      }
    }
    this.rollIndex = 0
    this.controlType = {}
    for (const p of players) {
      this.controlType[p] = 0
    }
  }

  public initBlockRestrictions() {
    this.players.forEach((player) => this.blockRestrictions[player] = [5, 5, 5, 5, 5])
  }

  public getHighestY(xpos: number, block: Tetromino) {
    let sum: number = 0
    let yVal: number = 0
    block.position.x = xpos
    block.position.y = 0
    const parts = block.getTranslatedBlock()
    const lowestYs: number[] = []
    for (const part of parts) {
      if (lowestYs[part.x] == null) {
        lowestYs[part.x] = 99
      }
      if (lowestYs[part.x] > part.y) {
        lowestYs[part.x] = part.y
      }
    }
    const lowestField = this.getLowestFromField()
    for (const part of parts) {
      if (lowestField[part.x] != null) {
        sum = lowestField[part.x] - lowestYs[part.x]
      } else {
        sum = -lowestYs[part.x]
      }
      if (sum > yVal) {
        yVal = sum
      }
    }
    return yVal
  }

  public gatherAllPositions() {
    const allPositions: IPosition[] = []
    this.blocks.forEach((block) => block.getTranslatedBlock().forEach((pos) => allPositions.push(pos)))
    return allPositions
  }

  public getLowestFromField() {
    const values: number[] = []
    this.blocks.forEach((block) => block.getTranslatedBlock().forEach((pos) => {
      if (values[pos.x] == null) {
        values[pos.x] = 0
      }
      if (values[pos.x] <= pos.y) {
        values[pos.x] = pos.y + 1
      }
    }))
    return values
  }

  public getHoverBlock() {
    let y
    const play = this.getPossiblePlays()[this.log.getCurrentPlay()]
    if (play != null) {
      y = this.getHighestY(play.x, new Tetromino(play.block, play.rotation, {
        x: play.x,
        y: 0
      }))
      const blockInstance = new Tetromino(play.block, play.rotation, {
        x: play.x,
        y
      })
      blockInstance.from = this.log.getCurrentPlayer()
      return blockInstance
    }
    return null
  }

  public canPlaceBlock(block: Tetromino) {
    let current_player = this.log.getCurrentPlayer()
    if (current_player == null || this.blockRestrictions[current_player][block.type] <= 0) {
      return false
    }
    if (block != null) {
      const ypos = this.getHighestY(block.position.x, block)
      block.position.y = ypos
      const parts = block.getTranslatedBlock()
      for (const part of parts) {
        if (part.y >= GAMEFIELD_MAX_HEIGHT || part.y < 0) {
          return false
        }
        if (part.x >= GAMEFIELD_MAX_WIDTH || part.x < 0) {
          return false
        }
      }
      const positions = this.gatherAllPositions()
      for (const position of positions) {
        for (const part of parts) {
          if (part.x === position.x && part.y === position.y) {
            return false
          }
        }
      }
      return true
    }
    return false
  }

  public getPossiblePlays(onlyInvalid: boolean = false) {
      const availablePlay: IPlay[] = []
      const blocksToCheck = this.deterministic_mode ? range(0, 5) : [this.log.getCurrentBlock()]
      let globalIndex = 0
      for (const block of blocksToCheck) {
        const currentBlock = new Tetromino(block, 0, {
            x: 0,
            y: 0
        })
        for (const xPos of range(0, GAMEFIELD_MAX_WIDTH)) {
          // isBlocked = true
          currentBlock.position = {
              x: xPos,
              y: 0
          }
          for (const rotation of range(0, amountRotations[block])) {
            currentBlock.rotation = rotation
            const canPlace = this.canPlaceBlock(currentBlock)
            if (canPlace && !onlyInvalid || !canPlace && onlyInvalid) {
                availablePlay.push({
                    x: xPos,
                    rotation,
                    block,
                    globalIndex
                })
            }
            globalIndex++
          }
        }
      }
      return availablePlay
  }

  public placeBlockUsingPlay(play_index: number) {
    const play = this.getPossiblePlays()[play_index]
    if (play != null) {
      return this.placeBlockWithPlay(play)
    }
    return false
  }

  public placeBlockWithPlay(play: IPlay) {
    const blockType = play.block
    const y = this.getHighestY(play.x, new Tetromino(blockType, play.rotation, {
      x: play.x,
      y: 0
    }))
    const block = new Tetromino(blockType, play.rotation, {
      x: play.x,
      y
    })
    block.from = this.log.getCurrentPlayer()
    return this.placeBlock(block)
  }

  public placeBlock(block: Tetromino) {
    if (this.canPlaceBlock(block)) {
      this.blocks.push(block)
      this.blockRestrictions[this.log.getCurrentPlayer()][block.type]--
      this.log.blockPlaced(this.log.getCurrentPlayer(),
        block.type, block.rotation, block.position.x, block.position.y)
      this.determineNextPlayer()
      // console.log("JSON IS", JSON.stringify(jsToRustLog(this.log, this.players)), this.blockRestrictions)
      return true
    }
    return false
  }

  public getScores() {
    const score = new GameScore(this)
    const scores = []
    for (const p of this.players) {
      scores.push(score.getScoreForPlayer(p))
    }
    return scores
  }

  public placeCurrentBlock() {
    const play = this.log.getCurrentPlay()
    if (play != null) {
      return this.placeBlockUsingPlay(play)
    }
    return false
  }

  public randomNextPlayer() {
    const next = randomInRange(0, this.players.length - 1)
    this.rollBlockFor(this.players[next])
    this.log.createConsideration()
  }

  public setCurrentPlay(newIndex: number) {
    this.log.createConsideration(newIndex)
  }

  public rollBlockFor(player: string) {
    let next = this.players.indexOf(player) + 1
    if (next >= this.players.length) {
      next = 0
    }
    let rolledBlock: number = 0
    if (this.deterministic_mode) {
      this.log.rolledBlock(this.players[next], rolledBlock)
    } else {
      let playerHasBlock = false
      let loopedOnce = false
      while (!playerHasBlock) {
          if (next >= this.players.length) {
            next = 0
            if (loopedOnce) {
              this.gameOver = true
              return false
            }
            loopedOnce = true
          }
          rolledBlock = this.rollBlock()
          if (this.blockRestrictions[this.players[next]][rolledBlock] > 0) {
              playerHasBlock = true
          } else {
              this.log.playerSkipped(this.players[next], rolledBlock, skipReason.blockUnavailable)
              next++
          }
      }
      this.log.rolledBlock(this.players[next], rolledBlock)
    }
    return true
  }

  public determineNextPlayer() {
    if (this.rollBlockFor(this.log.getCurrentPlayer())) {
      if (this.getPossiblePlays().length <= 0) {
        this.log.playerSkipped(this.log.getCurrentPlayer(),
          this.log.getCurrentBlock(), skipReason.unplacable)
        this.rollIndex++
        if (this.rollIndex >= this.players.length) {
          this.gameOver = true
        } else {
          this.determineNextPlayer()
        }
      } else {
        this.rollIndex = 0
        this.log.createConsideration()
      }
    }
  }

  public rollBlock() {
    return randomInRange(0, tetromino.l + 1)
  }

  public restoreFromLog(log: GameLog) {
    this.log = log
    this.blocks = log.getBlocks()
    this.initBlockRestrictions()
    for (const player of this.players) {
      this.blockRestrictions[player] = this.log.getBlockCount(player)
    }
    if (this.getPossiblePlays().length === 0) {
      this.gameOver = true
    }
  }

  public getPlayerColor(player: string) {
    if (this.playerColors[player]) {
      return this.playerColors[player]
    }
    return "#000"
  }

  public chooseFittingPlay(left?: boolean, isMove?: boolean, switchBlock?: boolean) {
    const plays = this.getPossiblePlays()
    let play_index = this.log.getCurrentPlay()
    let currentBlock = plays[play_index].block
    let currentRotation = plays[play_index].rotation
    let currentX = plays[play_index].x
    const maxRot = amountRotations[currentBlock]
    const changer = left ? -1 : 1
    let loopedOnce = false
    while (true) {
      if (switchBlock) {
        currentBlock += changer
        if (currentBlock < 0) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentBlock = 4
        } else if (currentBlock >= 5) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentBlock = 0
        }
      } else if (isMove) {
        currentX += changer
        if (currentX >= GAMEFIELD_MAX_WIDTH) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentX = 0
        } else if (currentX < 0) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentX = GAMEFIELD_MAX_WIDTH - 1
        }
      } else {
        currentRotation += changer
        if (currentRotation >= maxRot) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentRotation = 0
        } else if (currentRotation < 0) {
          if (loopedOnce) {return}
          loopedOnce = true
          currentRotation = maxRot - 1
        }
      }
      const foundIndex = findIndex(plays, {
        x: currentX,
        rotation: currentRotation,
        block: currentBlock
      })
      if (foundIndex !== -1) {
        this.setCurrentPlay(foundIndex)
        return
      }
    }
  }

  public moveBlock(left?: boolean) {
    this.chooseFittingPlay(left, true)
  }

  public rotateBlock(left?: boolean) {
    this.chooseFittingPlay(left, false)
  }
  public switchBlock(left?: boolean) {
    this.chooseFittingPlay(left, false, true)
  }

  public clone() {
    const newField = new GameField(this.players, cloneDeep(this.log))
    newField.playerColors = this.playerColors
    newField.controlType = this.controlType
    newField.deterministic_mode = this.deterministic_mode
    return newField
  }
}
