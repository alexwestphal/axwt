/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import {Element, ElementId} from '../../data'
import * as PV from '../PV'

import {ElementsState} from './ElementsState'




export const ElementsReducer: Reducer<ElementsState> = produce((draft: Draft<ElementsState>, action: PV.AnyAction) => {
    switch(action.type) {
        case 'pv/app/loadState':
            return action.payload.elements

        // Elements actions
        case 'pv/elements/deleteElement': {
            delete draft.byId[action.meta.elementId]
            if(draft.currentElement.elementId == action.meta.elementId) {
                draft.currentElement = null
            }
            break
        }
        case 'pv/elements/importPath':
        case 'pv/elements/newElement':
            draft.byId[action.meta.newElementId] = action.payload
            draft.currentElement = { elementType: action.payload.elementType, elementId: action.payload.elementId }
            break
        case 'pv/elements/selectCurrentElement':
            draft.currentElement = action.payload
            break
        case 'pv/elements/setHtmlId':
            selectElement(draft, action.meta.elementId).htmlId = action.payload
            break
        case 'pv/elements/setMainAttribute':
            selectElement(draft, action.meta.elementId)[action.meta.attrName] = (action.payload == null ? undefined : action.payload)
            break
        case 'pv/elements/setPresentationAttribute': {
            let presentation = selectElement(draft, action.meta.elementId).presentation
            presentation[action.meta.attrName as string] = (action.payload == null ? undefined : action.payload)
            break
        }
        case 'pv/elements/setShowElement':
            selectElement(draft, action.meta.elementId).showElement = action.payload
            break

        // Path Commands Actions
        case 'pv/pathSegments/deleteSegment': {
            let path = selectElement<Element.Path>(draft, action.meta.pathId)
            ArrayUtils.remove(path.segmentIds, action.meta.segmentId)
            break
        }
        case 'pv/pathSegments/newSegment': {
            let path = selectElement<Element.Path>(draft, action.meta.pathId)
            if(action.meta.afterSegmentId) {
                let index = path.segmentIds.indexOf(action.meta.afterSegmentId)
                path.segmentIds.splice(index, 0, action.meta.newPathSegmentId)
            } else {
                path.segmentIds.push(action.meta.newPathSegmentId)
            }
            break
        }

    }
}, ElementsState.Default)



const selectElement = <T extends Element = Element>(draft: Draft<ElementsState>, elementId: ElementId): Draft<T> => {
    let element = draft.byId[elementId]
    if(element === undefined) {
        console.warn(`Unable to select Element(${elementId}) in reducer`)
    }
    return element as Draft<T>
}