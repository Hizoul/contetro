import AppRouter from "isofw-web/src/app"
import * as React from "react"
import * as ReactDOM from "react-dom"

document.addEventListener(`DOMContentLoaded`, () => {
  ReactDOM.render(
    (
      <AppRouter />
    ),
    document.getElementById("root")
  )
})
