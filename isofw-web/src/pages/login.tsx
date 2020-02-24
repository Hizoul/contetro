import { AuthForm, MailField, PwField, useAuth } from "@xpfw/data"
import { SharedField } from "@xpfw/form"
import WebButton from "isofw-web/src/components/button"
import "isofw-web/src/components/form"
import PageContainer from "isofw-web/src/components/pageContainer"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"

const WebLogin = observer(() => {
  const southProps = useAuth()
  let msg
  if (southProps.error) {
    msg = (
      <div className="notification is-danger">
        {get(southProps, "error.message", "Error")}
      </div>
    )
  }
  if (southProps.loggedIn) {
    return (
      <PageContainer>
        <div className="miniContainer pullIntoHero">
          <div className="box">
            <WebButton
              className="is-primary is-fullwidth"
              onClick={southProps.submitLogout}
              loading={southProps.loading}
              text="logout"
              icon={{type: "font-awesome", name: "sign-out-alt"}}
              rightIcon={true}
            />
            {msg}
          </div>
        </div>
      </PageContainer>
    )
  }
  return (
    <PageContainer>
      <div className="miniContainer pullIntoHero">
        <div className="box">
          <SharedField schema={MailField} prefix={AuthForm.title} />
          <SharedField schema={PwField} prefix={AuthForm.title} />
          <WebButton
            className="is-primary is-fullwidth"
            onClick={southProps.submitLogin}
            loading={southProps.loading}
            text="login"
            icon={{type: "font-awesome", name: "sign-in-alt"}}
            rightIcon={true}
          />
          <WebButton
            className="marginTop is-info is-outlined is-fullwidth"
            onClick={southProps.submitRegister}
            loading={southProps.loading}
            text="register"
            icon={{type: "font-awesome", name: "plus"}}
            rightIcon={true}
          />
          {msg}
        </div>
      </div>
    </PageContainer>
  )
})

export default WebLogin
