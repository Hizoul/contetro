import urls from "isofw-shared/src/globals/url"
import { connect } from "isofw-web/src/backendConnection"
import "isofw-web/src/components/form"
import WebRemoteGameField from "isofw-web/src/components/gameSession/remote"
import PageContainer from "isofw-web/src/components/pageContainer"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import * as React from "react"
import { FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
connect()

const OnlineGameDetail: React.FunctionComponent<any> = (props) => {
  const id = get(props, "match.params.id")
  return (
    <PageContainer requireLoggedIn={true} backTo={urls.onlineMatchOverview}>
      <WebRemoteGameField
        fieldId={id}
        width={get(global, "window.innerWidth")}
        height={get(global, "window.innerHeight")}
      />
    </PageContainer>
  )
}

export default OnlineGameDetail
