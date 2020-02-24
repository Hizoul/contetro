import * as React from "react"

const Comp =  (props: any) => {
  let Child: any = props.children
  return (<div className="autoSizer"> <Child width={400} height={200} /> </div>)
}

export default Comp