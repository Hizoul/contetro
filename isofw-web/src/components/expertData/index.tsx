import { MailField, useAuth } from "@xpfw/data"
import useExpertDataCollector from "isofw-shared/src/components/expertDataCollect"
import WebRemoteGameField from "isofw-web/src/components/gameSession/remote"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaGamepad } from "react-icons/fa"
import WebButton from "../button"
import WithFieldBackground from "../gameSession/background/withFieldBackground"
import Loading from "../loading"

const WebExpertDataCollector: React.FunctionComponent<any> = observer((props) => {
  const expertData = useExpertDataCollector(props.userName, props.pw)
  if (!expertData.auth.connected) {
    return (
      <WithFieldBackground
        contentComponent={(pr) => {
          return (
            <div style={pr.buttonStyle} className="overlayBox whiteGradient centerText noFlex">
              Connecting to Server<br />
              Please wait <br />
              <Loading />
            </div>
          )
        }}
      />
    )
  }
  if (expertData.auth.loggedIn === false) {
    return (
      <WithFieldBackground
        contentComponent={(pr) => {
          return (
            <div style={pr.buttonStyle} className="overlayBox whiteGradient centerText noFlex">
              You are not logged in yet.<br />
              Automatically trying to login to {props.userName}.<br />
              {expertData.auth.error == null ?
                (<>
                  <span>The page is still loading so this will probably be done in a jiffy!<br /></span>
                  <Loading />
                </>)
                : "There was an error. Either the URL you received is faulty and will never work or reloading the page might fix it :)"}
            </div>
          )
        }}
      />
    )
  }
  if (expertData.hasActiveGame && expertData.gameId != null) {
    return (
      <WebRemoteGameField
        fieldId={expertData.gameId}
        width={get(global, "window.innerWidth", 320)}
        height={get(global, "window.innerHeight", 480)}
        showExpertHelpBtn={true}
      />
    )
  }
  return (
    <WithFieldBackground
      contentComponent={(pr) => {
        return (
          <>
            <div style={pr.buttonStyle} className="overlayBox whiteGradient centerText noFlex">
              Hello {get(expertData, "auth.user." + MailField.title)}!<br />
                Thanks for willing to participate in my experiment.<br />
                You can cancel and continue at any time, your progress will be right where you left off :)<br />
              {expertData.reward === -1 ? `` :
                `Given your actions a bot would recieve a numerical reward of ${expertData.reward}`}
            </div>
            <WebButton
              text="play"
              to=""
              style={pr.buttonStyle}
              noLink={true}
              className="blueGradient"
              icon={<FaGamepad />}
              isOverlay={true}
              leftIcon={true}
              onClick={expertData.startPlay}
              loading={expertData.loading}
            />
          </>
        )
      }}
    />
  )
})

export default WebExpertDataCollector
