
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import * as SU from '../SU'

import {SolveState} from './SolveState'

export const SolveReducer: Reducer<SolveState> = produce((draft: Draft<SolveState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/board/setMode':
            if(action.payload != 'Solve') {
                clearResult(draft)
            }
            break
        case 'su/solve/clear':
            clearResult(draft)
            break
        case 'su/solve/createSolution':
            draft.result = castDraft(action.payload)
            break
        case 'su/solve/play':
            draft.playback = 'Play'
            break
        case 'su/solve/pause':
            draft.playback = 'Pause'
            break
        case 'su/solve/reset':
            draft.playback = 'Reset'
            break
        case 'su/solve/setDirection':
            draft.solveDirection = action.payload
            clearResult(draft)
            break
        case 'su/solve/setPlaybackSpeed':
            draft.playbackSpeed = action.payload
            break
        case 'su/solve/setStepLimit':
            draft.stepLimit = action.payload
            break
        case 'su/solve/setStrategy':
            draft.strategy = action.payload
            break
        case 'su/solve/show':
            draft.playback = 'Show'
            break
    }
}, SolveState.Default)


const clearResult = (draft: Draft<SolveState>) => {
    draft.result = null
    draft.playback = 'Reset'
}