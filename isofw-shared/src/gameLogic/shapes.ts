import { IPosition, rotations, tetromino } from "./globals"

const amountRotations = {
  [tetromino.i]: 2,
  [tetromino.o]: 1,
  [tetromino.s]: 4,
  [tetromino.t]: 4,
  [tetromino.l]: 8
}

const tetrominoShapes: {[index: number]: {[index: number]: IPosition[]}} = {
  [tetromino.i]: {
    [rotations.normal]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 2,
        y: 0
      }, {
        x: 3,
        y: 0
      }
    ],
    [rotations.right]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 0,
        y: 2
      }, {
        x: 0,
        y: 3
      }
    ]
  },
  [tetromino.o]: {
    [rotations.normal]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 1,
        y: 1
      }
    ]
  },
  [tetromino.t]: {
    [rotations.normal]: [
      {
        x: 0,
        y: 0
      }, {
        x: -1,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 0,
        y: 1
      }
    ],
    [rotations.right]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 1,
        y: 0
      }, {
        x: 0,
        y: -1
      }
    ],
    [rotations.upsideDown]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: -1,
        y: 0
      }, {
        x: 0,
        y: -1
      }
    ],
    [rotations.left]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: -1,
        y: 0
      }, {
        x: 0,
        y: -1
      }
    ]
  },
  [tetromino.s]: {
    [rotations.normal]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 1,
        y: 1
      }, {
        x: 2,
        y: 1
      }
    ],
    [rotations.right]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: -1
      }, {
        x: 1,
        y: -1
      }, {
        x: 1,
        y: -2
      }
    ],
    [rotations.upsideDown]: [
      {
        x: 0,
        y: 0
      }, {
        x: -1,
        y: 0
      }, {
        x: -1,
        y: 1
      }, {
        x: -2,
        y: 1
      }
    ],
    [rotations.left]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 1,
        y: 1
      }, {
        x: 1,
        y: 2
      }
    ]
  },
  [tetromino.l]: {
    [rotations.normal]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 2,
        y: 0
      }, {
        x: 2,
        y: 1
      }
    ],
    [rotations.right]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 0,
        y: 2
      }
    ],
    [rotations.upsideDown]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 1,
        y: 1
      }, {
        x: 2,
        y: 1
      }
    ],
    [rotations.left]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 1,
        y: -1
      }, {
        x: 1,
        y: -2
      }
    ],
    [rotations.mirrorNormal]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 1,
        y: 0
      }, {
        x: 2,
        y: 0
      }
    ],
    [rotations.mirrorRight]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 1,
        y: 1
      }, {
        x: 1,
        y: 2
      }
    ],
    [rotations.mirrorUpsideDown]: [
      {
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }, {
        x: 2,
        y: 0
      }, {
        x: 2,
        y: -1
      }
    ],
    [rotations.mirrorLeft]: [
      {
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }, {
        x: 0,
        y: 2
      }, {
        x: 1,
        y: 2
      }
    ]
  }
}

export default tetrominoShapes
export {
  amountRotations
}
