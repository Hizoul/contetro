import { exec } from "shelljs"
import pd from "./projectDirectories"

const serverBuild = exec(`npm run devSsr`, {async: true, cwd: pd.web})

const serverMain = exec(`npm run devSsr`, {async: true, cwd: pd.ssr})
