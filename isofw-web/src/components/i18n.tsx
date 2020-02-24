import * as React from "react"
import i18n from "isofw-shared/src/util/i18n"

const Loading: React.FunctionComponent<{
  text: string
  props?: any[]
}> = (props) => {
  return (
    <span>
      {i18n.t(props.text, props.props)}
    </span>
  )
}

export default Loading
