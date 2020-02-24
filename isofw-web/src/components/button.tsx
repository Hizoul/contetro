
import i18n from "isofw-shared/src/util/i18n"
import { isObject } from "lodash"
import * as React from "react"
import { Link } from "react-router-dom"
import Loading from "./loading"

export interface IButton {
  className?: string
  text: string
  onClick?: any
  loading?: boolean
  disabled?: boolean
  icon?: any
  leftIcon?: boolean
  centerIcon?: boolean
  rightIcon?: boolean
  style?: any
  to?: any
  isOverlay?: boolean
  noLink?: boolean
}

const WebButton: React.FunctionComponent<IButton> = (props) => {
  let classNames = `${props.isOverlay ? "overlayButton flex alignCenter" : "button"} ${props.className}`
  let onClick = props.onClick
  if (props.loading) {
    onClick = undefined
    classNames += " is-loading is-outlined"
  }
  if (props.disabled) {
    onClick = undefined
    classNames += " is-outlined"
  }
  let IconToDisplay
  if (props.icon != null) {
    IconToDisplay = (
      <span className={`flex alignCenter ${props.centerIcon || props.rightIcon ? "" : "pullIconLeft"}`}>
        {props.icon}
      </span>
    )
  }
  if (props.noLink) {
    return (
      <a
        className={classNames}
        onClick={onClick}
        style={props.style}
      >
        {props.leftIcon ? IconToDisplay : null}
        <span className="flex1 justifyCenter">
          {props.centerIcon ? IconToDisplay : null}
          {props.loading ? <Loading /> : i18n.t(props.text)}
        </span>
        {props.rightIcon ? IconToDisplay : null}
      </a>
    )
  }
  return (
    <Link
      className={classNames}
      onClick={onClick}
      style={props.style}
      to={props.to}
    >
      {props.leftIcon ? IconToDisplay : null}
      <span className="flex1 justifyCenter">
        {props.centerIcon ? IconToDisplay : null}
        {props.loading ? <Loading /> : i18n.t(props.text)}
      </span>
      {props.rightIcon ? IconToDisplay : null}
    </Link>
  )
}

export default WebButton
