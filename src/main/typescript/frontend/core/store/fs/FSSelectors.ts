
import {Selector} from 'reselect'

import * as Core from '../Core'
import {FSState} from './FSState'


export const selectFSWorkspace: Selector<Core.State, FSState.Workspace, [string]> =
    (state, workspaceId) => state.fs.workspaces[workspaceId] ?? FSState.Workspace.Default