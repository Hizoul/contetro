import { get } from "lodash"
import { vsprintf } from "sprintf-js"

const translations = {
  home: "Home",
  login: "Login",
  logout: "Logout",
  register: "Register",
  localGame: "Local",
  onlineGame: "Online",
  settings: "Settings",
  back: "Back",
  welcomeBack: "Welcome Back %s!",
  matchCreated: "The Game has successfully been created. Should the game not popup automatically you can the button below to play!",
  goToMatch: "Play!",
  matchCreate: "Create Game",
  matches: "View Games",
  play: "Play",
  searchByName: "Search for Players by Name",
  against: "%i Players"
}

const i18n: {
  language: string
  data: any,
  addTranslations: (lanugage: string, data: Object) => void,
  t: (key: string, ...args: any[]) => string
} = {
  language: "en",
  data: {
    en: translations
  },
  addTranslations: (language, data) => {
    Object.assign(i18n.data[language], data)
  },
  t: (key, args) => {
    const v = get(i18n.data[i18n.language], key, key)
    return args != null && args.length > 0 ? vsprintf(v, args) : v
  }
}

export default i18n
