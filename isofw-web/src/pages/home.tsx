import { GAMEFIELD_MAX_WIDTH } from "isofw-shared/src/gameLogic/globals"
import urls from "isofw-shared/src/globals/url"
import WebButton from "isofw-web/src/components/button"
import WithFieldBackground from "isofw-web/src/components/gameSession/background/withFieldBackground"
import "isofw-web/src/customizedBulma.sass"
import * as React from "react"
import { FaCog, FaGamepad } from "react-icons/fa"
import { GiEarthAfricaEurope } from "react-icons/gi"

const Home: React.FunctionComponent<any> = (props) => {
  return (
    <WithFieldBackground
      contentComponent={({buttonStyle}) => {
        return (
          <>
            <WebButton
              style={buttonStyle}
              className="blueGradient"
              text="localGame"
              to={urls.local}
              icon={<FaGamepad />}
              isOverlay={true}
              leftIcon={true}
            />
            <WebButton
              style={buttonStyle}
              text="onlineGame"
              className="blueGradient"
              to={urls.online}
              icon={<GiEarthAfricaEurope />}
              isOverlay={true}
              leftIcon={true}
            />
            <WebButton
              style={buttonStyle}
              text="settings"
              className="blackGradient"
              to={urls.settings}
              icon={<FaCog />}
              isOverlay={true}
              leftIcon={true}
            />
          </>
        )
      }}
    />
  )
}

export default Home
