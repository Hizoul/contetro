import urls from "isofw-shared/src/globals/url"
import { useAuth } from "isofw-shared/src/util/xpfwdata"
import { connect } from "isofw-web/src/backendConnection"
import WebButton from "isofw-web/src/components/button"
import "isofw-web/src/components/form"
import WithFieldBackground, {
  IWithFieldBackground
} from "isofw-web/src/components/gameSession/background/withFieldBackground"
import I18n from "isofw-web/src/components/i18n"
import OverlayLogin from "isofw-web/src/components/online/login"
import OnlineMatchCreator from "isofw-web/src/components/online/matchCreator"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa"

connect()

const OnlineDashboardComponent: React.FunctionComponent<IWithFieldBackground> = observer((props) => {
  const authProps = useAuth()
  return (
    <>
      {authProps.loggedIn ? (
        <>
          <div style={props.buttonStyle} className="overlayBox noFlex whiteGradient">
            <I18n text="welcomeBack" props={[get(authProps, "user.email")]} />
          </div>
          <WebButton
            style={props.buttonStyle}
            to={urls.newMatch}
            loading={authProps.loading}
            text="matchCreate"
            icon={<FaSignOutAlt />}
            leftIcon={true}
            isOverlay={true}
            className="blueGradient"
          />
          <WebButton
            style={props.buttonStyle}
            to={urls.onlineMatchOverview}
            loading={authProps.loading}
            text="matches"
            icon={<FaSignOutAlt />}
            leftIcon={true}
            isOverlay={true}
            className="blueGradient"
          />
          <WebButton
            style={props.buttonStyle}
            onClick={authProps.submitLogout}
            to={urls.online}
            loading={authProps.loading}
            text="logout"
            icon={<FaSignOutAlt />}
            leftIcon={true}
            isOverlay={true}
            className="redGradient"
          />
        </>
      ) : (
        <OverlayLogin {...props} />
      )}
      <WebButton
        style={props.buttonStyle}
        text="back"
        to={urls.home}
        icon={<FaArrowLeft />}
        leftIcon={true}
        isOverlay={true}
        className="whiteGradient"
      />
    </>
  )
})

const OnlineDashboard: React.FunctionComponent<any> = (props) => {
  return (
    <WithFieldBackground
      contentComponent={OnlineDashboardComponent}
    />
  )
}

export default OnlineDashboard
