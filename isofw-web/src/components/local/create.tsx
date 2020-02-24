import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { LOCAL_COLORS } from "isofw-shared/src/gameLogic/globals"
import urls from "isofw-shared/src/globals/url"
import LocalFieldStore from "isofw-shared/src/store/localField"
import { FormStore, memo, SharedField } from "isofw-shared/src/util/xpfwform"
import { LocalPlayersField } from "isofw-shared/src/xpfwDefs/local"
import "isofw-web/src/components/form"
import * as React from "react"
import { FaPlay } from "react-icons/fa"
import WebButton from "../button"
import { IWithFieldBackground } from "../gameSession/background/withFieldBackground"

FormStore.setValue(LocalPlayersField.title, [
  {color: LOCAL_COLORS[0], controlType: 0}, {color: LOCAL_COLORS[1], controlType: 0}
])

const createLocalGame = (gameId: string) => {
  return () => {
    const players = FormStore.getValue(LocalPlayersField.title)
    const names: any = []
    const controlTypes: any = {}
    const colors: any = {}
    const usedColors = [0, 0, 0, 0]
    for (const p of players) {
      let color_index = LOCAL_COLORS.indexOf(p.color)
      console.log("FOR USED COLORS INDEX ", p.color, color_index)
      if (color_index != -1) {
        usedColors[color_index] += 1
      }
    }
    console.log("USED COLORS ARE", usedColors)
    const findUnusedColor = () => {
      for (let i = 0; i < 4; i++) {
        if (usedColors[i] === 0) {
          return i
        }
      }
      return -1
    }
    let findColor = (player: any) => {
      let colorIndex = LOCAL_COLORS.indexOf(player.color)
      console.log("INDEX OF PLAYER COLO", colorIndex, usedColors)
      if (colorIndex != -1) {
        if (usedColors[colorIndex] > 1) {
          console.log("COLOR USED MULTIPLE TIMES!")
          let unusedColor = findUnusedColor()
          console.log("FUND UNUSED", unusedColor)
          if (unusedColor != -1) {
            usedColors[colorIndex]--
            usedColors[unusedColor]++
            console.log("RETURNING", LOCAL_COLORS[unusedColor])
            return LOCAL_COLORS[unusedColor]
          }
          
        }
      }
      return player.color
    }
    for (const p of players) {
      let newColor = findColor(p)
      names.push(newColor)
      colors[newColor] = newColor
      controlTypes[newColor] = p.controlType
    }
    const f = new GameField(names)
    f.playerColors = colors
    f.controlType = controlTypes
    f.deterministic_mode = false
    LocalFieldStore.setField(gameId, f)
  }
}

const LocalCreateComponent: React.FunctionComponent<IWithFieldBackground> = (props) => {
  return (
    <>
      <div style={{...props.buttonStyle, fontSize: "5rem"}} className="overlayBox centerText noFlex blueGradient noPaddingTop">
        Contetro
      </div>
      <div style={props.buttonStyle} className="overlayBox noFlex whiteGradient noPaddingTop">
        <SharedField schema={LocalPlayersField} />
      </div>
      <WebButton
        style={props.buttonStyle}
        text="Play"
        icon={<FaPlay />}
        leftIcon={true}
        isOverlay={true}
        className="greenGradient"
        onClick={memo(() => createLocalGame("local"), ["createLocalGame", "local"])}
        to={`${urls.localMatchDetail}/local`}
      />
    </>
  )
}

export default LocalCreateComponent
