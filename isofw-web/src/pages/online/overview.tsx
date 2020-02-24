import urls from "isofw-shared/src/globals/url"
import { connect } from "isofw-web/src/backendConnection"
import "isofw-web/src/components/form"
import OnlineMatchOverviewComponent from "isofw-web/src/components/online/matchOverview"
import PageContainer from "isofw-web/src/components/pageContainer"
import "isofw-web/src/customizedBulma.sass"
import * as React from "react"
import { FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"

connect()

const OnlineMatchOverview: React.FunctionComponent<any> = (props) => {
  return (
    <div className="greyGradientBg">
    <PageContainer requireLoggedIn={true} backTo={urls.online}>
      <OnlineMatchOverviewComponent />
    </PageContainer>
    </div>
  )
}

export default OnlineMatchOverview
