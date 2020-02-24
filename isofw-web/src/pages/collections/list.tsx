import { BulmaList } from "@xpfw/data-bulma"
import { SchemaRegistry } from "@xpfw/form"
import "isofw-web/src/components/form"
import PageContainer from "isofw-web/src/components/pageContainer"
import { get } from "lodash"
import * as React from "react"

const ListPage: React.FunctionComponent<any> = (props) => {
  const collection = get(props, "match.params.collection")
  const form = SchemaRegistry.getSchema(collection)
  if (form == null) {
    return (
      <PageContainer requireLoggedIn={true}>Collection not found</PageContainer>
    )
  }
  return (
    <PageContainer requireLoggedIn={true}>
      List of {collection}
      <BulmaList schema={form} prefix="list" />
    </PageContainer>
  )
}
