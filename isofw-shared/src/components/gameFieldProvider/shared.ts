import { GameField } from "../../gameLogic/gameField"

export interface IGameFieldProviderProps {
  gameField: GameField
  game: any,
  loading?: boolean
  moveBlock: (left?: boolean) => void
  makePlay: () => void
  placeUsingPlay: (play_index: number) => void
  switchBlock: (left?: boolean) => void
  rotate: (left?: boolean) => void
}

export type GameFieldProviderHook = (fieldId: string, deterministic?: boolean) => IGameFieldProviderProps
