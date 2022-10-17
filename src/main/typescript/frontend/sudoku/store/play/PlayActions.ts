
import {Action, createAction} from '@axwt/core'

import {Sudoku} from '../../data'
import {selectTechnique, TechniqueKey, SearchResult, TechniqueOrder} from '../../technique'

import {selectEditBoard} from '../board'
import * as SU from '../SU'

import {selectCurrentPlayBoard, selectPlayState} from './PlaySelectors'
import {PlayEntryMode} from './PlayState'



export namespace PlayActions {

    export type ApplyNext = Action<'su/play/applyNext', SearchResult>

    export type ClearCell = Action<'su/play/clearCell', null, { x: number, y: number }>

    export type ClearCellCandidates = Action<'su/play/clearCellCandidates'>

    export type EndGame = Action<'su/play/end'>

    export type FindNext = Action<'su/play/findNext', TechniqueKey[]>
    export type FoundNext = Action<'su/play/foundNext', SearchResult | null>

    export type GenerateNotes = Action<'su/play/generateNotes', Sudoku.Board>

    export type SetCellCandidates = Action<'su/play/setCellCandidates', number[], { x: number, y: number }>

    export type SetCellValue = Action<'su/play/setCellValue', number, { x: number, y: number }>

    export type SetEntryMode = Action<'su/play/setEntryMode', PlayEntryMode>

    export type StartGame = Action<'su/play/start', Sudoku.Board>

    export type ToggleAssistant = Action<'su/play/toggleAssistant'>

    export type ToggleCellCandidate = Action<'su/play/toggleCellCandidate', number, { x: number, y: number }>

    export type ToggleHighlight = Action<'su/play/toggleHighlight'>

    export type ToggleTechnique = Action<'su/play/toggleTechnique', TechniqueKey>

    export type Any = ApplyNext | ClearCell | ClearCellCandidates | EndGame | FindNext | FoundNext | GenerateNotes | SetCellCandidates
        | SetCellValue |  SetEntryMode | StartGame | ToggleAssistant | ToggleCellCandidate | ToggleHighlight | ToggleTechnique


    export const applyNext = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let playState = selectPlayState(getState())
            dispatch(createAction('su/play/applyNext', playState.searchResult as SearchResult))
        }

    export const clearCell = (x: number, y: number): ClearCell =>
        createAction('su/play/clearCell', null, { x, y })

    export const clearCellCandidates = (): ClearCellCandidates => createAction('su/play/clearCellCandidates')

    export const endGame = (): EndGame => createAction('su/play/end')

    export const findNext = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let playState = selectPlayState(getState())

            let board = playState.current

            if(!playState.candidatesGenerated) board = dispatch(generateCandidates())

            dispatch(createAction('su/play/findNext', playState.techniques))

            let techniques = TechniqueOrder.filter(key => playState.techniques.includes(key)).map(selectTechnique)
            for(let technique of techniques) {
                let result = technique.find(board)
                if(result != null) {
                    dispatch(createAction('su/play/foundNext', result))
                    return
                }
            }

            dispatch(createAction('su/play/foundNext', null))
        }

    export const generateCandidates = (): SU.ThunkAction<Sudoku.Board> =>
        (dispatch, getState) => {
            let board = selectCurrentPlayBoard(getState())
            let updatedBoard = Sudoku.calculateCandidates(board)

            dispatch(createAction('su/play/generateNotes', updatedBoard))

            return updatedBoard
        }


    export const setCellCandidates = (x: number, y: number, candidates: number[]): SetCellCandidates =>
        createAction('su/play/setCellCandidates', candidates, { x, y })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/play/setCellValue', value, { x, y })

    export const setEntryMode = (entryMode: PlayEntryMode): SetEntryMode =>
        createAction('su/play/setEntryMode', entryMode)

    export const startGame = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let board = selectEditBoard(getState())
            dispatch(createAction('su/play/start', board))
        }

    export const toggleAssistant = (): ToggleAssistant => createAction('su/play/toggleAssistant')

    export const toggleCellCandidate = (x: number, y: number, candidate: number): ToggleCellCandidate =>
        createAction('su/play/toggleCellCandidate', candidate, { x, y })

    export const toggleHighlight = (): ToggleHighlight => createAction('su/play/toggleHighlight')

    export const toggleTechnique = (key: TechniqueKey): ToggleTechnique =>
        createAction('su/play/toggleTechnique', key)
}