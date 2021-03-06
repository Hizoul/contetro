import { getMapToFromProps, IFieldProps, SharedField, useObject } from "@xpfw/form"
import { observer } from "mobx-react-lite"
import * as React from "react"

const ObjectField: React.FunctionComponent<IFieldProps> = observer((props) => {
  const fieldHelper = useObject(props.schema, getMapToFromProps(props), props.prefix)
  return (
    <>
      {fieldHelper.fields.map((subField) =><SharedField {...subField} key={subField.mapTo} />)}
    </>
  )
})

export default ObjectField
