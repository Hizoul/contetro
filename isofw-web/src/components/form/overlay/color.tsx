import { getMapToFromProps, IFieldProps, useField } from "isofw-shared/src/util/xpfwform"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { SketchPicker } from "react-color"
import "./relationshipOverlay.sass"

const ColorField: React.FunctionComponent<IFieldProps> = observer((props) => {
  const fieldProps = useField(getMapToFromProps(props), props.prefix, {
    valueEventKey: "hex"
  })
  return (
    <div className="colorContainer">
      <SketchPicker
        color={fieldProps.value}
        onChangeComplete={fieldProps.setValue}
        // presetColors={[]}
      />
    </div>
  )
})

export default ColorField
