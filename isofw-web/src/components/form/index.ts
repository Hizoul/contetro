import { ComponentRegistry} from "@xpfw/form"
import { registerComponents as rg} from "@xpfw/form-web"
import { registerComponents } from "@xpfw/form-bulma"
import { registerComponents as uiComponents } from "@xpfw/data-bulma"
import { ColorField } from "isofw-shared/src/xpfwDefs/user"
import ColorTheme from "./overlay/color"
import LocalColorTheme from "./overlay/local_color"
import OverlayArrayTheme from "./overlay/array"
import OverlayObjectTheme from "./overlay/object"
import { LocalPlayersField, LocalPlayerField, LocalPlayerControl } from 'isofw-shared/src/xpfwDefs/local'
import OverlaySelectField from './overlay/selectField';

rg()
registerComponents()
uiComponents()

ComponentRegistry.registerComponent("array", OverlayArrayTheme, LocalPlayersField.theme)
ComponentRegistry.registerComponent("object", OverlayObjectTheme, LocalPlayerField.theme)
ComponentRegistry.registerComponent("string", ColorTheme, ColorField.theme)
ComponentRegistry.registerComponent("string", LocalColorTheme, ColorField.theme+"_local")
ComponentRegistry.registerComponent("number", OverlaySelectField, LocalPlayerControl.theme)
