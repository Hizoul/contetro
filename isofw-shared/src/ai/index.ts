import { Tetromino } from "../gameLogic/tetromino"
import { GameField } from "../gameLogic/gameField"
import { GAMEFIELD_MAX_WIDTH } from "../gameLogic/globals";
import { GameScore } from "../gameLogic/gameScore";

const SCORE_MODIFIER = 0.01;

const heuristic_touching = (field: GameField, player: string) => {
  let score = 0
  const playerBlocks = field.log.getBlocksPerPlayer(field)
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
        connected.forEach((conblock) => alreadyCounted.push(conblock))
        score += connected.length
    }
  })
  return score
}


const heuristic_connectability = (field: GameField, player: string) => {
  let score = 0
  const playerBlocks = field.log.getBlocksPerPlayer(field)
  const lowestField = field.getLowestFromField()
  playerBlocks[player].forEach((block) => {
    const block_positions = block.getTranslatedBlock()
    block_positions.forEach((pos) => {
      let current_y = lowestField[pos.x];
      let y_cmp = pos.y + 1
      if (current_y === y_cmp) {
        score += SCORE_MODIFIER
      }
      if (pos.x -1 >= 0) {
        let left_y = lowestField[pos.x -1]
        if (left_y <= pos.y) {
          score += SCORE_MODIFIER
        }
      }
      if (pos.x + 1 < GAMEFIELD_MAX_WIDTH) {
        let right_y = lowestField[pos.x +1]
        if (right_y <= pos.y) {
          score += SCORE_MODIFIER
        }
      }
    })
  })
  return score
}

const heuristic_enemy_block = (field: GameField, player: string) => {
  let score = 0
  const playerBlocks = field.log.getBlocksPerPlayer(field)
  const lowestField = field.getLowestFromField()
  const player_index = field.players.indexOf(player)
  const other_player_index = (player_index === 1) ? 0 : 1
  const other_player = field.players[other_player_index]
  console.log("GOT PLAYER", player, other_player, playerBlocks)
  playerBlocks[player].forEach((block) => {
    const player_block = block.getTranslatedBlock()
    playerBlocks[other_player].forEach((block) => {
      const opponent_block = block.getTranslatedBlock()
      player_block.forEach((p1) => {
        opponent_block.forEach((p2) => {
          if (((p1.y == p2.y) && (p1.x == (p2.x + 1) || 
          p1.x == (p2.x - 1))) ||
          ((p1.x == p2.x) && p1.y == (p2.y + 1))) {
            score += SCORE_MODIFIER
          }
        })
      })
    })
  })
  return score
}


const get_best_heuristic_play = (field: GameField, player: string) => {
  return get_best_heuristic_play_for_params(field, player, 0.3, 0.5, 1.0, 20.0)
}

const get_best_heuristic_play_for_params = (field: GameField, player: string, connectability_weight: number, enemy_block_weight: number, touching_weight: number, score_weight: number) => {
  let current_best_heu = -99999999999;
  let best_play_index = -1;
  field.getPossiblePlays().forEach((possible_play) => {
    const future_field = field.clone()
    const placed = future_field.placeBlockUsingPlay(possible_play.globalIndex)
    const gameScore = new GameScore(future_field)
    if (!placed) {
      console.log("Couldn't make a possible play, somethings wrong!")
    }
    let heuristic_value = 0
    heuristic_value += heuristic_connectability(future_field, player) * connectability_weight
    heuristic_value += heuristic_enemy_block(future_field, player) * enemy_block_weight
    heuristic_value += heuristic_touching(future_field, player) * touching_weight
    heuristic_value += gameScore.getScoreForPlayer(player) * score_weight
    if (heuristic_value > current_best_heu) {
      current_best_heu = heuristic_value
      best_play_index = possible_play.globalIndex
    }
  })
  return best_play_index
}

export {
  heuristic_connectability, heuristic_touching, heuristic_enemy_block, get_best_heuristic_play, get_best_heuristic_play_for_params
}