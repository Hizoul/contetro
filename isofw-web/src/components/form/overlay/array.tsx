import { getMapToFromProps, IFieldProps, prependPrefix, SharedField, useArray } from "@xpfw/form"
import { observer } from "mobx-react-lite"
import { get } from "lodash"
import * as React from "react"
import WebButton from 'isofw-web/src/components/button'
import { FaPlus, FaTrashAlt, FaBan } from 'react-icons/fa'

const OverlayArrayTheme: React.FunctionComponent<IFieldProps> = observer((props) => {
  const arrayHelper = useArray(props.schema, getMapToFromProps(props), props.prefix)
  const underMaximum = get(props.schema, "maximum", 99) >= arrayHelper.length
  const underMinimum = get(props.schema, "minimum", 1) >= arrayHelper.length
  return (
    <>
      {arrayHelper.fields.map((field) => {
        return (
        <div className="card fullWidthCard whiteGradient alignCenter justifyCenter flexRow" key={prependPrefix(field.mapTo, field.prefix)}>
          <div className="flexColumn divMargin">
            <SharedField schema={field.schema} mapTo={field.mapTo} prefix={field.prefix} />
          </div>
          <WebButton
            text=""
            className={underMinimum ? "" : " is-warning"}
            icon={underMinimum ? <FaBan /> : <FaTrashAlt />}
            style={{marginLeft: "0.5rem"}}
            centerIcon={true}
            disabled={underMinimum}
            onClick={field.decreaseSize}
          />
        </div>
      )})}
      {underMaximum ? (
        <div
          className="card fullWidthCard whiteGradient alignCenter justifyCenter"
          style={{padding: "0"}}
        >
          <WebButton
            className="is-fullwidth is-info makeSquare"
            text="Add"
            icon={<FaPlus />}
            rightIcon={true}
            onClick={arrayHelper.increaseSize}
          />
        </div>
      ) : undefined }
    </>
  )
})

export default OverlayArrayTheme
