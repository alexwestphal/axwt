

import {DraftRequest} from '../../data'


export interface DraftState {
    current: DraftRequest
}

export namespace DraftState {
    export const Default: DraftState = {
        current: null,
    }
}