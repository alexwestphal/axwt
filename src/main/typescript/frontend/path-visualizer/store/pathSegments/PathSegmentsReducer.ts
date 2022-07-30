/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {Element, PathSegment} from '../../data'

import * as PV from '../PV'

import {PathSegmentsState} from './PathSegmentsState'



export const PathSegmentsReducer: Reducer<PathSegmentsState> = produce((draft: Draft<PathSegmentsState>, action: PV.AnyAction) => {
    switch (action.type) {
        case 'pv/app/loadState':
            return action.payload.pathSegments

        // Element Actions
        case 'pv/elements/deleteElement':
            if(Element.isPath(action.payload)) {
                for(let segmentId of action.payload.segmentIds) {
                    delete draft.byId[segmentId]
                    if(draft.highlight.segmentId == segmentId) {
                        draft.highlight = null
                    }
                }
            }
            break
        case 'pv/elements/importPath':
            for(let segment of  action.meta.segments) {
                draft.byId[segment.segmentId] = segment
            }
            break
        case 'pv/elements/newElement':
            if(action.payload.elementType == 'path') {
                let newSegmentId = (action.payload as Element.Path).segmentIds[0]
                draft.byId[newSegmentId] = { segmentId: newSegmentId, command: 'M', arguments: { x: 0, y: 0 }, implicit: false }
            }
            break

        // Path Segment Actions
        case 'pv/pathSegments/deleteSegment':
            delete draft.byId[action.meta.segmentId]
            break
        case 'pv/pathSegments/newSegment':
            draft.byId[action.meta.newPathSegmentId] = action.payload
            break
        case 'pv/pathSegments/setArgValue': {
            let { segmentId, argName} = action.meta
            draft.byId[segmentId].arguments[argName] = action.payload
            break
        }
        case 'pv/pathsSegments/setCommand': {
            let existing = draft.byId[action.meta.segmentId]
            draft.byId[action.meta.segmentId] = PathSegment.convert(existing, action.payload)
            break
        }
        case 'pv/pathSegments/selectHighlight':
            draft.highlight = action.payload
            break

    }
}, PathSegmentsState.Default)