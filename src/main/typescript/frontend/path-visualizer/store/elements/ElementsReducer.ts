/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import {Element} from '../../data'
import * as PV from '../PV'

import {ElementsState} from './ElementsState'




export const ElementsReducer: Reducer<ElementsState> = produce((draft: Draft<ElementsState>, action: PV.AnyAction) => {
    switch(action.type) {
        case 'pv/app/loadState':
            return action.payload.elements

        // Elements actions
        case 'pv/elements/importPath':
        case 'pv/elements/newElement':
            draft.byId[action.meta.newElementId] = action.payload
            break
        case 'pv/elements/setCurrentElement':
            draft.currentElement = action.payload
            break
        case 'pv/elements/setShowElement':
            draft.byId[action.meta.elementId].showElement = action.payload
            break

        // Path Commands Actions
        case 'pv/pathSegments/deleteSegment': {
            let path = draft.byId[action.meta.pathId] as Draft<Element.Path>
            ArrayUtils.remove(path.segmentIds, action.meta.segmentId)
            break
        }
        case 'pv/pathSegments/newSegment': {
            let path = draft.byId[action.meta.pathId] as Draft<Element.Path>
            path.segmentIds.push(action.meta.newPathSegmentId)
            break
        }

    }
}, ElementsState.Default)