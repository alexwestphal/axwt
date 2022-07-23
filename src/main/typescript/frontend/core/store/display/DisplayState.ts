

import {UUID} from '@axwt/core/data'

export type DrawerState = 'Open' | 'Closed' | 'Locked'

export type WindowMode = 'Normal' | 'Dual'

export interface WindowSpec {
    width: number,
    height: number,
    screenX: number,
    screenY: number
}

export interface DisplayState {
    leftDrawer: DrawerState,
    rightDrawer: DrawerState,
    title: string
    
    focusBlockId: null | UUID
    forceFocus: boolean

    windowMode: WindowMode
    windowSpecNormal?: WindowSpec
    secondaryWindowId?: UUID

}
export namespace DisplayState {

    export const Default: DisplayState = {
        leftDrawer: 'Closed',
        rightDrawer: 'Closed',
        title: "",

        focusBlockId: null,
        forceFocus: false,

        windowMode: 'Normal',
    }
}