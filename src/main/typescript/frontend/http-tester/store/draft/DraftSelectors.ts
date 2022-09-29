
import {Selector} from 'reselect'

import {DraftRequest} from '../../data'

import * as HT from '../HT'

export const selectCurrentDraft: Selector<HT.RootState, DraftRequest> =
    (state) => state.ht.draft.current