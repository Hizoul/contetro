import { IFieldProps } from "isofw-shared/src/util/xpfwform"
import { observer } from "mobx-react-lite"
import * as React from "react"
import "./relationshipOverlay.sass"
import { SelectField } from '@xpfw/form-web'

const OverlaySelectField: React.FunctionComponent<IFieldProps> = observer((props) => {
  return (
      <SelectField {...props} />
  )
})

export default OverlaySelectField
