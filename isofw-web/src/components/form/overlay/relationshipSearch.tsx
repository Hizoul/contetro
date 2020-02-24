import { useList } from "@xpfw/data"
import { prependPrefix, SharedField } from "@xpfw/form"
import { get } from "lodash"
import { observer } from "mobx-react-lite"
import * as React from "react"
import WebRelationshipItem from "./relationshipItem"
import TextInputOverlay from './textField';

const WebRelationshipSearch: React.FunctionComponent<any> = observer((props) => {
  const searchField = get(props, `searchForm.properties[${get(props, "schema.relationship.namePath")}]`)
  const nameObjs: any = []
  const addId = get(props, "addId")
  const removeId = get(props, "removeId")
  const field = get(props, "schema")
  const relList = useList(props.searchForm, undefined, prependPrefix(props.prefix, "search"))
  for (const child of get(relList, "list.data", [])) {
    nameObjs.push(<WebRelationshipItem schema={field} item={child} addId={addId} removeId={removeId} isAdd={true} />)
  }
  return (
    <>
      <TextInputOverlay
        schema={searchField}
        prefix={prependPrefix(props.searchForm.title, prependPrefix(props.prefix, "search"))}
      />
      {nameObjs}
    </>
  )
})

export default WebRelationshipSearch
