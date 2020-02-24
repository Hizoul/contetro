import * as React from "react"
import "./loading.sass"

const Loading: React.FunctionComponent<any> = (props) => {
  return (
    <div className="lds-ellipsis">
      <div/><div/><div/><div/>
    </div>
  )
}

const LoadingOverlay: React.FunctionComponent<any> = (props) => {
  return (
    <div className="overlay">
      <span>Loading please wait</span>
      <Loading />
      <span>
        If you play against actual AI the response time might vary between 15 to 60 seconds!
      </span>
    </div>
  )
}

export default Loading
export {
  LoadingOverlay
}
