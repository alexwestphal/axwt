
import {Selector} from 'reselect'

import * as SU from '../SU'

import {AppMode} from '../../data'

export const selectAppMode: Selector<SU.RootState, AppMode> =
    (state) => state.su.app.appMode