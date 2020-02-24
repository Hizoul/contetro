import * as React from "react"

class CustComponent extends React.Component<any, any> {
  public render() {
    const View = this.props.view
    return <View text="shared" />
  }
}

const AnyComp: any = CustComponent

export default AnyComp
