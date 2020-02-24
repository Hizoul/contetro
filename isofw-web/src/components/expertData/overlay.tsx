import remoteFieldHook from "isofw-shared/src/components/gameFieldProvider/remote"
import { observable } from "mobx"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaQuestionCircle, FaTimes } from "react-icons/fa"
import "./style.sass"

const showExpertHelp = observable.box(false)

const ExpertHelpBtn = () => {
  return (
    <div className="overlay expertHelpBtn" onClick={() => showExpertHelp.set(true)}>
      <FaQuestionCircle />
    </div>
  )
}
const ExpertHelp = () => {
  return (
    <div className="overlay" style={{textAlign: "center"}} onClick={() => showExpertHelp.set(false)}>
      Click anywhere to close.<br />&nbsp;<br />
      Mobile Controls:<br />
      Move Block: Swipe Left and Right<br />
      Turn Block: Swipe Up and Down<br />
      Place Block: Double Tap<br />
      Change Block: Single Tap<br />&nbsp;<br />
      Keyboard Controls:<br />
      Move Block: Arrow Left and Right<br />
      Turn Block: Arrow up and Down<br />
      Place Block: Enter<br />
      Change Block: Shift<br />
    </div>
  )
}

export {
  showExpertHelp, ExpertHelpBtn, ExpertHelp
}
