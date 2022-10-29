
import {UUID} from '@axwt/core'

import {BoardSize, BoardType} from './board'

export type SaveStatus = 'Unsaved' | 'Saved' | 'Dirty'

export interface BoardSave {
    boardId: UUID
    boardName: string

    boardSize: BoardSize
    boardType: BoardType
    completeBoard?: number[]
    givenBoard?: number[]
}