import { IRelationshipHookProps, useRelationshipWithProps } from "@xpfw/data"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import WebRelationshipItem from "./relationshipItem"
import WebRelationshipSearch from "./relationshipSearch"
import "./relationshipOverlay.sass"
const RelationshipMultiOverlay: React.FunctionComponent<IRelationshipHookProps & {
  isSearch?: boolean
}> = observer((props) => {
  let content: any
  const relationHelper = useRelationshipWithProps(props)
  if (props.isSearch) {
    return (
      <div>
        <WebRelationshipSearch
          {...relationHelper}
          {...props}
        />
      </div>
    )
  } else if (Array.isArray(relationHelper.relatedObject)) {
    const relationItems = []
    for (const child of relationHelper.relatedObject) {
      relationItems.push(<WebRelationshipItem schema={props.schema} item={child} addId={relationHelper.addId} removeId={relationHelper.removeId} isAdd={false} />)
    }
    content = relationItems
  }
  return (
    <>
      {content}
    </>
  )
})

export default RelationshipMultiOverlay
