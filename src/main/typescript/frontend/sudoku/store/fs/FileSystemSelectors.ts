
import {Selector} from 'reselect'

import * as SU from '../SU'
import {FileSystemState} from './FileSystemState'

export const selectFSState: Selector<SU.RootState, FileSystemState> =
    (state) => state.su.fs