import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { observable, action } from "mobx"
import { get_best_heuristic_play } from "isofw-shared/src/ai";
let randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}
export class LocalFieldStore {
  @observable
  private fields: {[path: string]: GameField} = {}

  @action
  public setField(valuePath: string, value: GameField) {
    this.fields[valuePath] = value
  }

  public getField(path: string): GameField {
    let to_return = this.fields[path]
    if (to_return != null) {
      setTimeout(() => {
        console.log("Checking for action needed")
        let field_to_use = to_return.clone()
        let current_player = field_to_use.log.getCurrentPlayer()
        let possible_plays = field_to_use.getPossiblePlays()
        console.log("Checking control type ", field_to_use.controlType[current_player] ,field_to_use.controlType[current_player] != 0)
        // while ( possible_plays.length > 0  && field_to_use.controlType[current_player] != 0) {
          if (field_to_use.controlType[current_player] == 1) {
            console.log("About to do Heuristics Decision")
              const best_play = get_best_heuristic_play(field_to_use, current_player)
              console.log("GOT best play", best_play)
              if (best_play != -1) {
                field_to_use.placeBlockUsingPlay(best_play)
                this.setField(path, field_to_use.clone())
              }
          } else if (field_to_use.controlType[current_player] == 2) {
            console.log("doing random decision")
              let possible_plays = field_to_use.getPossiblePlays()
              if (possible_plays.length > 0) {
                let play_index = randomNum(0, possible_plays.length-1)
                field_to_use.placeBlockUsingPlay(play_index)
                this.setField(path, field_to_use.clone())
              }
          }
          current_player = field_to_use.log.getCurrentPlayer()
        // }#

        
      }, 1) 
    }
    return to_return
  }
}

export default new LocalFieldStore()
