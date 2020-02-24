import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { observable, action } from "mobx"
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
      let current_player = to_return.log.getCurrentPlayer()
      if (to_return.controlType[current_player] == 1) {
        setTimeout(() => {
          let possible_plays = to_return.getPossiblePlays()
          if (possible_plays.length > 0) {
            let play_index = randomNum(0, possible_plays.length-1)
            to_return.placeBlockUsingPlay(play_index)
            this.setField(path, to_return.clone())
          }
        }, 1)
      }
    }
    return to_return
  }
}

export default new LocalFieldStore()
