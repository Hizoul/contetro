import { exampleRustLog, jsToRustLog, rustToJsLog } from "isofw-shared/src/util/rustLogParser"
import { isEqual } from "lodash"

test("rust conversion back and forth yields same result", () => {
  const g = rustToJsLog(exampleRustLog)
  expect(g).toMatchSnapshot("parsed to js")
  const p: any = [0, 1]
  const rustJson = jsToRustLog(g, p)
  const g2 = rustToJsLog(rustJson)
  expect(isEqual(g2, g)).toBeTruthy()
})
