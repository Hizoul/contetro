import * as React from "react"

const pose = {
  div: () => {
    return (props: any) => {
      return (
        <div className="POSEDIV">{props.children}</div>
      )
    }
  }
}

export default pose