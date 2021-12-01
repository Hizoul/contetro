import { exampleRustLog, scoreExampleRustLog, jsToRustLog, rustToJsLog, heuristicLog1, heuristicLog2 } from "isofw-shared/src/util/rustLogParser"
import { isEqual } from "lodash"
import { get_best_heuristic_play } from "isofw-shared/src/ai"
import { GameField } from "isofw-shared/src/gameLogic/gameField"

test("heuristic has same values as rust", () => {
  let log = rustToJsLog(heuristicLog1)
  let g = new GameField(["0", "1"], log)
  let best_play = get_best_heuristic_play(g, 0)
  expect(best_play).toMatchSnapshot("Best Play choice for log")





  log = rustToJsLog(heuristicLog2)
  g = new GameField(["0", "1"], log)
  best_play = get_best_heuristic_play(g, 0)
  expect(best_play).toMatchSnapshot("Best Play choice for log")
})
