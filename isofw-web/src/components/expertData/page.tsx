
import "isofw-shared/src/xpfwDefs"
import { connect } from "isofw-web/src/backendConnection"
import { get } from "lodash"
import * as React from "react"
import WebExpertDataCollector from "."
connect(false)

const ExpertPage: React.FunctionComponent<any> = (props) => {
  const authData = get(global, "window.location.hash", "#/")
  const splitted = atob(authData.substr(2)).split(":")
  return (
    <WebExpertDataCollector
      userName={splitted[0].replace(/\n/g, "")}
      pw={splitted[1].replace(/\n/g, "")}
    />
  )
}

export default ExpertPage
