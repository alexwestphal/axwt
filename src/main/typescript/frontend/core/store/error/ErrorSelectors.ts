import {Selector} from 'reselect'


import {AXWTAnomaly} from '@axwt/core/data'

import * as Core from '../Core'

export const selectLatestError: Selector<Core.State, AXWTAnomaly | null> = (state) => state.error.latestError


export const selectShowError: Selector<Core.State, boolean> = (state) => state.error.showError