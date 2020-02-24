import { IGameFieldProviderProps } from "isofw-shared/src/components/gameFieldProvider/shared"
import * as React from "react"
import Hammer from "react-hammerjs"
import FieldInfoOverlay from "./infoOverlay"
import PureField, { IGameFieldDisplay } from "./pureField"
import "./style.sass"

class WebGameFieldDisplay extends React.Component<IGameFieldDisplay & IGameFieldProviderProps, any>  {
  public timer: any
  public componentWillMount() {
    document.body.addEventListener("keyup", this.handleKey)
  }
  public componentWillUnmount() {
    document.body.removeEventListener("keyup", this.handleKey)
  }
  public render() {
    return (
      <Hammer
        onSwipe={this.handleSwipe}
        onTap={this.props.switchBlock}
        onDoubleTap={this.props.makePlay}
        onClick={this.checkClick}
        direction="DIRECTION_ALL"
      >
        <div>
          <FieldInfoOverlay {...this.props} gameField={this.props.gameField} />
          <PureField {...this.props} />
        </div>
      </Hammer>
    )
  }
  private checkClick = (event: any) => {
    if (this.timer) {
      clearTimeout(this.timer)
      delete this.timer
      this.props.makePlay()
    }
    this.timer = setTimeout(() => {
      delete this.timer
      this.props.switchBlock()
    }, 250)
  }
  private handleKey = (event: any) => {
    if (!this.props.loading) {
      switch (event.keyCode) {
        case 37: case 39: {
          this.props.moveBlock(event.keyCode === 37)
          return
        }
        case 38: case 40: {
          this.props.rotate(event.keyCode === 38)
          return
        }
        case 16: {
          this.props.switchBlock()
          return
        }
        case 13: case 32: case 33: {
          this.props.makePlay()
          return
        }
      }
    }
  }
  private handleSwipe = (a: any) => {
    if (!this.props.loading) {
      if (a.direction === 2 || a.direction === 4) {
        this.props.moveBlock(a.direction === 2)
      } else if (a.direction === 8 || a.direction === 16) {
        this.props.rotate(a.direction === 8)
      }
    }
  }
}

export default WebGameFieldDisplay
