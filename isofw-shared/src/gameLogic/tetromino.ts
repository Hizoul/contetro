import { IPosition } from "./globals"
import tetrominoShapes from "./shapes"

export class Tetromino {
  public position: IPosition
  public type: number
  public rotation: number
  public from: string
  public touchingBlocks: Tetromino[]
  private checkedBlocks: Tetromino[]
  constructor(type: number, rotation: number, position: IPosition) {
    this.type = type
    this.rotation = rotation
    this.position = position
    this.touchingBlocks = []
    this.checkedBlocks = []
    this.from = ""
  }
  public getBlock() {
    return tetrominoShapes[this.type][this.rotation]
  }
  public getTranslatedBlock() {
    const block = this.getBlock()
    if (block != null) {
      const newBlock = []
      for (const item of block) {
        newBlock.push({
          x: this.position.x + item.x,
          y: this.position.y + item.y
        })
      }
      return newBlock
    }
    return block
  }
  public addTouchingBlock(block: Tetromino) {
    if (this.touchingBlocks.indexOf(block) === -1) {
      this.touchingBlocks.push(block)
    }
  }
  public getConnectedBlocks() {
    this.checkedBlocks = []
    for (const block of this.touchingBlocks) {
      this.checkBlock(block)
    }
    return this.checkedBlocks
  }
  private checkBlock(block: Tetromino) {
    if (this.checkedBlocks.indexOf(block) === -1) {
      this.checkedBlocks.push(block)
      for (const childBlock of block.touchingBlocks) {
        this.checkBlock(childBlock)
      }
    }
  }
}
