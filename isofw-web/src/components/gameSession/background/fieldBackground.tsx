import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { Tetromino } from "isofw-shared/src/gameLogic/tetromino"
import val from "isofw-shared/src/globals/val"
import { randomColor, randomInRange } from "isofw-shared/src/util"
import PureField from "isofw-web/src/components/game/pureField"
import * as React from "react"
import { LOCAL_COLORS } from 'isofw-shared/src/gameLogic/globals';

export interface IRandomBlock {
  tetromino: Tetromino
  initialPosition: string
}

const initGf = () => {
  const gameField = new GameField(["a", "b", "c", "d"])
  gameField.playerColors = {a: LOCAL_COLORS[0], b: LOCAL_COLORS[1], c: LOCAL_COLORS[2], d: LOCAL_COLORS[3]}
  return gameField
}

class FieldBackground extends React.Component<any, any> {
  public state = {gameField: initGf()}
  private timerId: any = null
  public handleTick = () => {
    const g = this.state.gameField.clone()
    if (g.gameOver) {
      this.setState({gameField: initGf()})
    } else {
      g.placeBlockUsingPlay(randomInRange(0, g.getPossiblePlays().length))
      this.setState({gameField: g})
    }
  }
  public componentDidMount() {
    this.timerId = setInterval(this.handleTick, val.animationTime)
  }
  public componentWillUnmount() {
    clearInterval(this.timerId)
  }
  public render() {
    return (
      <PureField
        width={this.props.width}
        height={this.props.height}
        gameField={this.state.gameField}
        hideHover={true}
      />
    )
  }
}

export default FieldBackground
