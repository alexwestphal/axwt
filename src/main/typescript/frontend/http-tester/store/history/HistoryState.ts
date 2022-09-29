
import {Request} from '../../data'

export interface HistoryState {
    requests: Request[]
}

export namespace HistoryState {
    export const Default: HistoryState = {
        requests: []
    }
}