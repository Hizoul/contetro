import urls from "isofw-shared/src/globals/url"
import "isofw-web/src/components/form"
import WebGameHistory from "isofw-web/src/components/local/history"
import PageContainer from "isofw-web/src/components/pageContainer"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import * as React from "react"

const OnlineHistoryPage: React.FunctionComponent<any> = (props) => {
  const id = get(props, "match.params.id")
  return (
    <PageContainer backTo={urls.online}>
      <WebGameHistory
        fieldId={id}
        isRemote={true}
        width={get(global, "window.innerWidth")}
        height={get(global, "window.innerHeight") - 37}
      />
    </PageContainer>
  )
}

export default OnlineHistoryPage
