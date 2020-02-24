import { GameScore } from "isofw-shared/src/gameLogic/gameScore"
import { observable } from "mobx"
import { observer, useObservable } from "mobx-react-lite"
import * as React from "react"
import { FaInfoCircle, FaArrowLeft } from "react-icons/fa"
import WebButton from '../button'
import { LOCAL_COLORS } from 'isofw-shared/src/gameLogic/globals'
import { get } from "lodash"

const blockNames = ["I", "O", "S", "T", "L"]
const colorNames = {
  [LOCAL_COLORS[0]]: "Blue",
  [LOCAL_COLORS[1]]: "Red",
  [LOCAL_COLORS[2]]: "Green",
  [LOCAL_COLORS[3]]: "Yellow"
}


const FieldInfoOverlay: React.FunctionComponent<any> =
observer((props) => {
  const isShown = useObservable(observable.box(false))
  let isGameOver = props.gameField != null && props.gameField.gameOver === true
  if (isShown.get() === true && props.gameField != null || isGameOver) {
    const gameField = props.gameField
    const scores = gameField.getScores()
    let getPlayerName = (name: any) => get(colorNames, name, name)
    const score = gameField.players.map(
    (player: any, indx: number) => <span key={player}>{getPlayerName(player)}: {scores[indx]}</span>)
    const blocks = gameField.players.map(
      (player: any, indx2: number) => (
        <span key={player}>
          <h3>{getPlayerName(player)}</h3>
          {blockNames.map((blockName, blockIdx) =>
            <span key={blockName}>{blockName}: {gameField.blockRestrictions[player][blockIdx]}&nbsp;</span>)}
        </span>
      )
    )
    let gameOverBlock
    if (isGameOver) {
      let score = new GameScore(props.gameField)
      let winInfo = score.getWinner()
      gameOverBlock = (
        <>
          <h1>Game Over!</h1>
          <h1>{winInfo.isDraw ? `It's a draw! Multiple people scored ${winInfo.maxScore}` : `${getPlayerName(winInfo.winner)} won with ${winInfo.maxScore} points`}</h1>
        </>
      )
    }
    return (
      <div
        className="overlay"
        onClick={() => {
          isShown.set(false)
        }}
      >
        {gameOverBlock}
        <h2>Scores</h2>
        {score}
        <h2>Blocks</h2>
        {blocks}
        {isGameOver ?
        <WebButton
          style={{marginTop: "1rem", fontSize: "1.5rem", width: props.width - 20, paddingTop: "0.4rem", paddingBottom: "0.4rem", paddingLeft: "0.4rem", borderRadius: "90pt"}}
          text="Back"
          leftIcon={true}
          icon={<FaArrowLeft />}
          isOverlay={true}
          className="greenGradient"
          to="/"
        />
        : <span>Click anywhere to close.<br />&nbsp;<br /></span>}
      </div>
    )
  } else {
    return (
      <div
        className="infoButton"
        onClick={() => {
          isShown.set(true)}}
      >
        <FaInfoCircle />
      </div>
    )
  }
})

export default FieldInfoOverlay
