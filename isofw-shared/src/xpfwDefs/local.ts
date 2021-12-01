import { cloneDeep } from "lodash"
import { ColorField } from "./user"

const LocalColorField = cloneDeep(ColorField)
LocalColorField.theme += "_local"
const LocalPlayerControl = {
  title: "controlType",
  type: "number",
  format: "select",
  theme: "player_control",
  selectOptions: [
    {value: 0, label: "Human"},
    {value: 1, label: "AI (Medium / Heuristic)"},
    {value: 2, label: "AI (Dumb / Random)"}
  ]
}
const LocalPlayerField = {
  title: "player",
  type: "object",
  theme: "local_player",
  properties: {
    [String(LocalColorField.title)]: LocalColorField,
    [String(LocalPlayerControl.title)]: LocalPlayerControl
  }
}

const LocalPlayersField = {
  title: "players",
  type: "array",
  theme: "overlay",
  items: LocalPlayerField,
  minimum: 2,
  maximum: 4
}

export {
  LocalPlayerField, LocalPlayersField, LocalPlayerControl
}
