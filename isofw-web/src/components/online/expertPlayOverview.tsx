
import { GameField } from "isofw-shared/src/gameLogic/gameField"
import { GameLog } from "isofw-shared/src/gameLogic/gamelog"
import { GameScore } from "isofw-shared/src/gameLogic/gameScore"
import urls from "isofw-shared/src/globals/url"
import { ListStore, toJS, useAuth, useList, UserStore } from "isofw-shared/src/util/xpfwdata"
import { GameSessionForm } from "isofw-shared/src/xpfwDefs/gameLog"
import "isofw-web/src/components/form"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as moment from "moment"
import * as React from "react"
import { Link } from "react-router-dom"
import Loading from "../loading"
import "./matchOverview.sass"

ListStore.pageSize = 50
const OnlineMatchOverviewComponent: React.FunctionComponent<any> = observer(() => {
  const list = useList(GameSessionForm, undefined, "matchOverview")
  const data = get(list, "list.data", [])
  const height = get(global, "window.innerHeight")
  const heightToUse = height - 150
  if (list.loading === true) {
    return <div className="center"><Loading /></div>
  }
  return (
    <div className="noFlex matchList">
      {data.map((session: any) => {
        console.log("SESSION IS", toJS(session))
          let log, game, score, playerScore, botScore, botWon, isRandom, player, gameOver, players
          if (Array.isArray(session.log) && Array.isArray(session.players)) {
            log = new GameLog(toJS(session.log))
            game = new GameField(toJS(session.players), log, true)
            score = new GameScore(game)
            playerScore = score.getScoreForPlayerAtIndex(0)
            botScore = score.getScoreForPlayerAtIndex(1)
            botWon = botScore > playerScore
            isRandom = session.players[1] === "bot_random"
            player = session.players[0]
            gameOver = game.gameOver
            players = session.$players
          } else {
            playerScore = 0
            botScore = 0
            botWon = false
            isRandom = false
            player = "none"
            gameOver = false
            players = []
          }
          return (
            <div key={session._id} className="card inlineBlock" style={{maxWidth: heightToUse / 2}}>
              <div className="card-header flexColumn">
                <div className="noFlex has-text-centered">
                  {session.$players == null ? null : session.$players.map((p: any, index: any) =>
                    p._id === UserStore.getUser()._id ? undefined : (
                    <span key={index}>
                      {index > 0 && index < session.$players.length ? ", " : ""}
                      {p.email}
                    </span>
                  ))}
                </div>
                <span className="subTitle has-text-centered">
                  {moment(session.createdAt).format("LL")}
                  <span className="is-pulled-right">
                    {session.players.length}P
                  </span>
                </span>
              </div>
              <div>
                Over: {String(game == null ? false : game.gameOver)}<br />
                Score: Player {playerScore}<br />
                Score: Bot {botScore}<br />
                Bot Won: {String(botWon)}<br />
                Draw: {String(botScore === playerScore)}<br />
                israndom: {String(isRandom)}<br />
                #1 is: {session.players[0]}<br />
                #2 is: {session.players[1]}<br />
              </div>
                <Link
                  to={`${gameOver ? urls.onlineMatchHistory : urls.onlineMatchDetail}/${session._id}`}
                >
                  {/* <WebRemoteGameField
                    width={heightToUse / 2}
                    height={heightToUse}
                    fieldId={session._id}
                    noBg={true}
                  /> */}
                  View Match
                </Link>
            </div>)
        })}
    </div>
  )
})

export default OnlineMatchOverviewComponent
