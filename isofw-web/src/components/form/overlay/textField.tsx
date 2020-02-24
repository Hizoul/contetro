import { TextField } from "@xpfw/form-web"
import i18n from "isofw-shared/src/util/i18n"
import { IFieldProps } from "isofw-shared/src/util/xpfwform"
import { observer } from "mobx-react-lite"
import * as React from "react"
import "./relationshipOverlay.sass"

const TextInputOverlay: React.FunctionComponent<IFieldProps> = observer((props) => {
  return (
      <TextField {...props} className="input fullInput" placeholder={i18n.t("searchByName")} />
  )
})

export default TextInputOverlay
