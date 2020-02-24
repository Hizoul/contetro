
import urls from "isofw-shared/src/globals/url"
import { useList, UserStore, ListStore } from "isofw-shared/src/util/xpfwdata"
import { GameSessionForm } from "isofw-shared/src/xpfwDefs/gameLog"
import "isofw-web/src/components/form"
import WebRemoteGameField from "isofw-web/src/components/gameSession/remote"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as moment from "moment"
import * as React from "react"
import { Link } from "react-router-dom"
import "./matchOverview.sass"

ListStore.pageSize = 50
const OnlineMatchOverviewComponent: React.FunctionComponent<any> = observer(() => {
  const list = useList(GameSessionForm, undefined, "matchOverview")
  const data = get(list, "list.data", [])
  const height = get(global, "window.innerHeight")
  const heightToUse = height - 150
  return (
    <div className="noFlex matchList">
      {data.map((session: any) => (
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
            <Link
              to={`${urls.onlineMatchDetail}/${session._id}`}
            >
              <WebRemoteGameField
                width={heightToUse / 2}
                height={heightToUse}
                fieldId={session._id}
                noBg={true}
              />
            </Link>
        </div>
      ))}
    </div>
  )
})

export default OnlineMatchOverviewComponent
