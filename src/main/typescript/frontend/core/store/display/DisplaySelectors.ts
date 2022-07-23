
import {Selector} from 'reselect'

import {UUID} from '@axwt/core/data'

import * as Core from '../Core'
import {DisplayState, WindowMode, WindowSpec} from './DisplayState'

export const selectDisplay: Selector<Core.State, DisplayState> = (state) => state.display

export const selectFocusBlock: Selector<Core.State, null | UUID> = (state) => state.display.focusBlockId

export const selectWindowMode: Selector<Core.State, WindowMode> = (state) => state.display.windowMode

export const selectWindowSpecNormal: Selector<Core.State, WindowSpec> = (state) => state.display.windowSpecNormal