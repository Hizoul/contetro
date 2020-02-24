import { GameField } from "./gameField"
import { logType } from "./globals"
import { Tetromino } from "./tetromino"

export interface IGameLogItem {
  type: number
  payload: any
}

export class GameLog {
  public log: IGameLogItem[]
  constructor(previousLog?: IGameLogItem[]) {
    this.log = Array.isArray(previousLog) ? previousLog : []
  }
  public addItem(item: IGameLogItem) {
    this.log.push(item)
  }

  public blockPlaced(user: string, blockType: number, blockOrientation: number, x: number, y: number) {
    this.addItem({
      type: logType.placed,
      payload: {
        from: user,
        block: blockType,
        orientation: blockOrientation,
        x, y
      }
    })
  }

  public rolledBlock(user: string, block: number) {
    this.addItem({
      type: logType.rolled,
      payload: {
        from: user,
        block
      }
    })
  }

  public playerSkipped(user: string, block: number, reason: number) {
    this.addItem({
      type: logType.skipped,
      payload: {
        from: user, block, reason
      }
    })
  }

  public createConsideration(play_index: number = 0) {
    this.addItem({
      type: logType.considering,
      payload: {
        play_index
      }
    })
  }

  public getBlocks() {
    const blocks: Tetromino[] = []
    this.log.forEach((item) => {
      if (item.type === logType.placed) {
        const tetromino = new Tetromino(item.payload.block, item.payload.orientation, {
          x: item.payload.x,
          y: item.payload.y
        })
        tetromino.from = item.payload.from
        blocks.push(tetromino)
      }
    })
    return blocks
  }

  public getBlocksPerPlayer(gameField: GameField) {
    const playerBlocks: {[index: string]: Tetromino[]} = {}
    gameField.players.forEach((player) => playerBlocks[player] = [])
    for (const item of this.log) {
      if (item.type === logType.placed) {
        playerBlocks[item.payload.from].push(new Tetromino(item.payload.block, item.payload.orientation, {
          x: item.payload.x,
          y: item.payload.y
        }))
      }
    }
    return playerBlocks
  }

  public getLatestRolled() {
    let i
    i = this.log.length - 1
    while (i >= 0) {
      if (this.log[i].type === logType.rolled) {
        return this.log[i]
      }
      i--
    }
    return null
  }

  public getCurrentBlock() {
    const roll: any = this.getLatestRolled()
    if (roll != null) {
      return roll.payload.block
    }
  }

  public getCurrentPlayer() {
    const roll: any = this.getLatestRolled()
    if (roll != null) {
      return roll.payload.from
    }
  }

  public getCurrentPlay() {
    let entry
    entry = this.log[this.log.length - 1]
    if (entry.type === logType.considering) {
        return entry.payload.play_index
    }
    return 0
  }

  public getBlockCount(player: string) {
    const blocks = [5, 5, 5, 5, 5]
    this.log.forEach((entry) => {
      if (entry.type === logType.placed && entry.payload.from === player) {
        blocks[entry.payload.block]--
      }
    })
    return blocks
  }
}
