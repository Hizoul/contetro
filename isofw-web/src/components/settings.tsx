import i18n from "isofw-shared/src/util/i18n"
import { useAuth, useEdit } from "isofw-shared/src/util/xpfwdata"
import { SharedField } from "isofw-shared/src/util/xpfwform"
import { ColorField, UserForm } from "isofw-shared/src/xpfwDefs/user"
import { observer } from "mobx-react-lite";
import * as React from "react"
import ColorTheme from "./form/overlay/color"
import PermissionErrorComponent from "./permError"

const SettingsComponent: React.FunctionComponent<any> = observer((props) => {
  const authProps = useAuth()
  if (authProps.connected && authProps.loggedIn) {
    const editProps = useEdit(authProps.user._id, UserForm, undefined, "SETTINGS")
    return (
      <>
        <ColorTheme schema={ColorField} prefix={UserForm.title} theme={ColorField.theme}/>
      </>
    )
  }
  return (
    <>
      <PermissionErrorComponent />
    </>
  )
})

export default SettingsComponent
