import urls from "isofw-shared/src/globals/url"
import { connect } from "isofw-web/src/backendConnection"
import WebButton from "isofw-web/src/components/button"
import "isofw-web/src/components/form"
import WithFieldBackground from "isofw-web/src/components/gameSession/background/withFieldBackground"
import SettingsComponent from "isofw-web/src/components/settings"
import "isofw-web/src/customizedBulma.sass"
import * as React from "react"
import { FaArrowLeft } from "react-icons/fa"
connect()
const Settings: React.FunctionComponent<any> = (props) => {
  return (
    <WithFieldBackground
      contentComponent={({buttonStyle}) => {
        return (
          <>
           <SettingsComponent />
            <WebButton
              style={buttonStyle}
              text="back"
              to={urls.home}
              icon={<FaArrowLeft />}
              leftIcon={true}
              isOverlay={true}
              className="whiteGradient"
            />
          </>
        )
      }}
    />
  )
}

export default Settings
