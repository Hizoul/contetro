import { Hook } from "@feathersjs/feathers"
import { PlayersField } from "isofw-shared/src/xpfwDefs/gameLog"

const onlyAllowPlayers: Hook = async (hook) => {
  hook.data = {[String(PlayersField.title)]: hook.data[String(PlayersField.title)]}
  return hook
}

export default onlyAllowPlayers
