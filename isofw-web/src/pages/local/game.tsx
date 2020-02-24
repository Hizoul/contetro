import { GameField } from "isofw-shared/src/gameLogic/gameField"
import urls from "isofw-shared/src/globals/url"
import "isofw-web/src/components/form"
import WebLocalGameField from "isofw-web/src/components/gameSession/local"
import PageContainer from "isofw-web/src/components/pageContainer"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import * as React from "react"

const OnlineGameDetail: React.FunctionComponent<any> = (props) => {
  const id = get(props, "match.params.id")
  return (
    <PageContainer backTo={urls.home}>
      <WebLocalGameField
        fieldId={id}
        width={get(global, "window.innerWidth")}
        height={get(global, "window.innerHeight")}
      />
    </PageContainer>
  )
}

export default OnlineGameDetail
