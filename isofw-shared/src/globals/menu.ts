import url from "isofw-shared/src/globals/url"
import val from "isofw-shared/src/globals/val"

const menuEntriesLoggedOut = () => [
  {path: url.home, name: "Contetro", icon: {}},
  {path: url.login, name: "login", icon:  {}}
]
const menuEntriesLoggedIn = () => [
  {path: url.home, name: "Game Overview", icon: {}},
  {path: url.play, name: "Play", icon: {}},
  {path: url.newMatch, name: "New Match", icon: {}},
  {path: url.login, name: "logout", icon: {}}
]

export {
  menuEntriesLoggedIn,
  menuEntriesLoggedOut
}
