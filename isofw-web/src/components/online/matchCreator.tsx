import urls from "isofw-shared/src/globals/url"
import { useCreate, useAuth } from "isofw-shared/src/util/xpfwdata"
import { GameSessionForm, PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"
import WebButton from "isofw-web/src/components/button"
import { IWithFieldBackground } from "isofw-web/src/components/gameSession/background/withFieldBackground"
import I18n from "isofw-web/src/components/i18n"
import "isofw-web/src/customizedBulma.sass"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaPlayCircle, FaPlusCircle } from "react-icons/fa"
import RelationshipMultiOverlay from "../form/overlay/relationshipMulti"
import RelationshipOverlayItem from "../form/overlay/relationshipItem"

const OnlineMatchCreator: React.FunctionComponent<IWithFieldBackground> = observer((props) => {
  const createProps = useCreate(GameSessionForm, undefined, undefined)
  const authProps = useAuth()
  let msg
  if (createProps.state != null) {
    return (
    <>
      <div style={props.buttonStyle} className="overlayBox noFlex greenGradient">
        <I18n text="matchCreated" />
      </div>
        <WebButton
          style={props.buttonStyle}
          to={`${urls.onlineMatchDetail}/${get(createProps, "state._id")}/`}
          text="goToMatch"
          icon={<FaPlayCircle />}
          leftIcon={true}
          isOverlay={true}
          className="greenGradient"
        />
    </>)
  }
  return (
      <>
        <div style={props.buttonStyle} className="overlayBox noFlex whiteGradient">
          <span>Participating Players</span>
          <RelationshipOverlayItem
            schema={PlayersField}
            item={authProps.user}
            noAction={true}
          />
          <RelationshipMultiOverlay schema={PlayersField} prefix={GameSessionForm.title} />
        </div>
        <WebButton
          style={props.buttonStyle}
          onClick={createProps.submitCreate}
          loading={createProps.loading}
          text="matchCreate"
          icon={<FaPlusCircle />}
          leftIcon={true}
          isOverlay={true}
          className="greenGradient"
        />
        <div style={props.buttonStyle} className="overlayBox noFlex whiteGradient">
          <RelationshipMultiOverlay
            schema={PlayersField}
            prefix={GameSessionForm.title}
            isSearch={true}
          />
        </div>
        {createProps.error != null ? (
          <div style={props.buttonStyle} className="overlayBox noFlex redGradient">
            {JSON.stringify(createProps.error.stack ? createProps.error.stack : createProps.error)}
          </div>
        ) : undefined}
      </>
    )
})

export default OnlineMatchCreator
