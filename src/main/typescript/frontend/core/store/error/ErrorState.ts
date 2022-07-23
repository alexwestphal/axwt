

import {AXWTAnomaly} from '@axwt/core/data'

export interface ErrorState {
    latestError?: AXWTAnomaly
    showError: boolean
}
export namespace ErrorState {
    export const Default: ErrorState = {
        latestError: null,
        showError: false
    }
}