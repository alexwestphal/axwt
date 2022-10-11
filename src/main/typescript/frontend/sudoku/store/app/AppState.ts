
import {AppMode} from '../../data'

export interface AppState {
    appMode: AppMode
}
export namespace AppState {
    export const Default: AppState = {
        appMode: 'Define'
    }
}