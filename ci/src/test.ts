import { exec } from "shelljs"
import pd from "./projectDirectories"

for (const key in pd) {
  const dir = pd[key]
  if (dir !== pd.ci) {
    exec(`${pd.ci}/node_modules/.bin/jest --coverage`, {cwd: dir})
  }
}
