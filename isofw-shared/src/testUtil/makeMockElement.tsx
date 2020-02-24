import * as React from "react"

const makeMockElement = (name: string) => {
  return (props: any) => (
    <div className={name}>
      {JSON.stringify(props, undefined, 2)}
    </div>
  )
  }

export default makeMockElement
