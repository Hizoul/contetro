
export interface IPosition {
  x: number, y: number
}

export type Block = IPosition[]

const tetromino = {
  i: 0, o: 1, t: 2, s: 3, l: 4
}

const rotations = {
  normal: 0, right: 1, upsideDown: 2, left: 3, mirrorNormal: 4, mirrorRight: 5, mirrorUpsideDown: 6, mirrorLeft: 7
}

const logType = {
  rolled: 0, placed: 1, skipped: 2, considering: 3
}

const skipReason = {
  unplacable: 0, blockUnavailable: 1
}

const GAMEFIELD_MAX_WIDTH = 10
const GAMEFIELD_MAX_HEIGHT = 20

const LOCAL_COLORS = ["#1273de", "#b80000", "#008b02", "#fccb00"]

export {
  tetromino, rotations, logType, skipReason, GAMEFIELD_MAX_WIDTH, GAMEFIELD_MAX_HEIGHT,
  LOCAL_COLORS
}
