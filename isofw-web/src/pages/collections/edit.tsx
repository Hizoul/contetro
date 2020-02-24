import { BulmaEdit } from "@xpfw/data-bulma"
import { SchemaRegistry } from "@xpfw/form"
import "isofw-web/src/components/form"
import PageContainer from "isofw-web/src/components/pageContainer"
import { get } from "lodash"
import * as React from "react"

const EditPage: React.FunctionComponent<any> = (props) => {
  const collection = get(props, "match.params.collection")
  const id = get(props, "match.params.id")
  const form = SchemaRegistry.getSchema(collection)
  if (form == null) {
    return (
      <PageContainer requireLoggedIn={true}>Collection not found</PageContainer>
    )
  }
  return (
    <PageContainer requireLoggedIn={true}>
      Create of {collection}
      <BulmaEdit schema={form} id={id} prefix="edit" />
    </PageContainer>
  )
}

export default EditPage
