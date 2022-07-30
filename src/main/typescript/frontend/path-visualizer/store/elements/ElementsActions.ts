/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction, UUID} from '@axwt/core'

import {ElementKey, Element, ElementId, ElementType, PathSegment, PresentationAttributes} from '../../data'
import {ThunkAction} from '../PV'
import {selectElement, selectSegmentsByPath} from '@axwt/path-visualizer/store'

export namespace ElementsActions {

    export type DeleteElement = Action<'pv/elements/deleteElement', Element, { elementId: ElementId }>

    export type ImportPath = Action<'pv/elements/importPath', Element, { newElementId: ElementId, segments: PathSegment[] }>

    export type NewElement = Action<'pv/elements/newElement', Element, { newElementId: ElementId }>

    export type SelectCurrentElement = Action<'pv/elements/selectCurrentElement', ElementKey>

    export type SetClassName = Action<'pv/elements/setClassName', string, { elementId: ElementId }>

    export type SetHtmlId = Action<'pv/elements/setHtmlId', string, { elementId: ElementId }>

    export type SetMainAttribute = Action<'pv/elements/setMainAttribute', any | null, { elementId: ElementId, attrName: string}>

    export type SetPresentationAttribute = Action<'pv/elements/setPresentationAttribute', any | null, { elementId: ElementId, attrName: keyof PresentationAttributes}>

    export type SetShowElement = Action<'pv/elements/setShowElement', boolean, { elementId: ElementId }>

    export type Any = DeleteElement | ImportPath | NewElement | SelectCurrentElement | SetClassName | SetHtmlId
        | SetMainAttribute | SetPresentationAttribute | SetShowElement


    export const deleteElement = (elementId: ElementId): ThunkAction =>
        (dispatch, getState) => {
            let state = getState()
            let element = selectElement(state, elementId)
            dispatch(createAction('pv/elements/deleteElement', element, { elementId }))
        }

    export const importPath = (d: string): ImportPath => {
        let segments = PathSegment.parse(d)
        let element = { ... Element.create('path'), segmentIds: segments.map(segment => segment.segmentId) }

        return createAction('pv/elements/importPath', element, { newElementId: element.elementId, segments })
    }

    export const newElement = (elementType: ElementType, newElementId: ElementId = UUID.create()): NewElement =>
        createAction('pv/elements/newElement', Element.create(elementType, newElementId), { newElementId })

    export const selectCurrentElement = (elementKey: ElementKey): SelectCurrentElement =>
        createAction('pv/elements/selectCurrentElement', elementKey)

    export const setClassName = (elementId: ElementId, value: string): SetClassName =>
        createAction('pv/elements/setClassName', value, { elementId })

    export const setHtmlId = (elementId: ElementId, value: string): SetHtmlId =>
        createAction('pv/elements/setHtmlId', value, { elementId })

    export const setMainAttribute = <E extends Element>(elementId: ElementId, attrName: keyof E, attrValue: any | null): SetMainAttribute =>
        createAction('pv/elements/setMainAttribute', attrValue, { elementId, attrName: attrName as string })


    export const setPresentationAttribute = <K extends keyof PresentationAttributes>(elementId: ElementId, attrName: K, attrValue: PresentationAttributes[K] | null): SetPresentationAttribute =>
        createAction('pv/elements/setPresentationAttribute', attrValue, { elementId, attrName })

    export const setShowElement = (elementId: ElementId, value: boolean): SetShowElement =>
        createAction('pv/elements/setShowElement', value, { elementId })
}