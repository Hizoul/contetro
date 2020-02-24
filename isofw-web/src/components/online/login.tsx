import { AuthForm, MailField, PwField, useAuth } from "@xpfw/data"
import { SharedField } from "@xpfw/form"
import WebButton from "isofw-web/src/components/button"
import "isofw-web/src/components/form"
import { IWithFieldBackground } from "isofw-web/src/components/gameSession/background/withFieldBackground"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaPlusCircle, FaSignInAlt } from "react-icons/fa"

const OverlayLogin: React.FunctionComponent<IWithFieldBackground> = observer(({buttonStyle}) => {
  const southProps = useAuth()
  let msg
  if (southProps.error) {
    msg = (
      <div style={buttonStyle} className="overlayBox noFlex redGradient">
        {JSON.stringify(get(southProps, "error", "Error"))}
      </div>
    )
  }
  return (
    <>
      <div style={buttonStyle} className="overlayBox noFlex whiteGradient">
        <SharedField schema={MailField} prefix={AuthForm.title} />
        <SharedField schema={PwField} prefix={AuthForm.title} />
      </div>
      <WebButton
        style={buttonStyle}
        onClick={southProps.submitLogin}
        loading={southProps.loading}
        text="login"
        icon={<FaSignInAlt />}
        leftIcon={true}
        isOverlay={true}
        className="greenGradient"
      />
      <WebButton
        style={buttonStyle}
        onClick={southProps.submitRegister}
        loading={southProps.loading}
        text="register"
        leftIcon={true}
        isOverlay={true}
        icon={<FaPlusCircle />}
        className="blueGradient"
      />
      {msg}
    </>
  )
})

export default OverlayLogin
