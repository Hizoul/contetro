import { isString } from "lodash"
import { sed } from "shelljs"
import pd from "./projectDirectories"

const newVersion = process.argv[2]

if (!isString(newVersion) || newVersion.length < 3) {
  console.log(`No Version specified`)
  process.exit(-1)
}

console.log("Setting to version", newVersion)

for (const key in pd) {
  sed("-i", `"version": ".*",`, `"version": "${newVersion}",`, `${pd[key]}/package.json`)
}
sed("-i", `version: ".*"`, `version: "${newVersion}"`, `${pd.shared}/src/globals/val.ts`)
process.exit(0)
