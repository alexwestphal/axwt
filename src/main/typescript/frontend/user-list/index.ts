
import UserList from './components/UserList'

import {Module, createModuleLauncher, DisplayActions} from '@axwt/core'

export const ULModule: Module = {
    moduleCode: 'UL',
    displayName: 'user-list',

    reducer: (state) => state ?? {},

    extraArgs: {},

    render: UserList,

    initAction: () =>
        (dispatch) => {
            dispatch(DisplayActions.setTitle("User List"))
        }
}

export default createModuleLauncher(ULModule)