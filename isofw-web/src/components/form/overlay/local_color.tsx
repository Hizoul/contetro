import { LOCAL_COLORS } from 'isofw-shared/src/gameLogic/globals';
import { getMapToFromProps, IFieldProps, useField } from "isofw-shared/src/util/xpfwform"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { CirclePicker  } from "react-color"
import "./relationshipOverlay.sass"

const ColorField: React.FunctionComponent<IFieldProps> = observer((props) => {
  const fieldProps = useField(getMapToFromProps(props), props.prefix, {
    valueEventKey: "hex"
  })
  return (
    <div className="colorContainer" style={{marginLeft: "0.3rem"}}>
      <CirclePicker
        color={fieldProps.value}
        onChangeComplete={fieldProps.setValue}
        colors={LOCAL_COLORS}
        width={150}
        // presetColors={[]}
      />
    </div>
  )
})

export default ColorField
