/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction, UUID} from '@axwt/core'

import {ElementKey, Element, ElementId, ElementType, PathSegment} from '../../data'

export namespace ElementsActions {

    export type ImportPath = Action<'pv/elements/importPath', Element, { newElementId: ElementId, segments: PathSegment[] }>

    export type NewElement = Action<'pv/elements/newElement', Element, { newElementId: ElementId }>

    export type SelectCurrentElement = Action<'pv/elements/selectCurrentElement', ElementKey>

    export type SetHtmlId = Action<'pv/elements/setHtmlId', string, { elementId: ElementId }>

    export type SetShowElement = Action<'pv/elements/setShowElement', boolean, { elementId: ElementId }>

    export type Any = ImportPath | NewElement | SelectCurrentElement | SetHtmlId | SetShowElement


    export const importPath = (d: string): ImportPath => {
        let segments = PathSegment.parse(d)
        let element = { ... Element.create('path'), segmentIds: segments.map(segment => segment.segmentId) }

        return createAction('pv/elements/importPath', element, { newElementId: element.elementId, segments })
    }

    export const newElement = (elementType: ElementType, newElementId: ElementId = UUID.create()): NewElement =>
        createAction('pv/elements/newElement', Element.create(elementType, newElementId), { newElementId })

    export const selectCurrentElement = (elementKey: ElementKey): SelectCurrentElement =>
        createAction('pv/elements/selectCurrentElement', elementKey)

    export const setHtmlId = (elementId: ElementId, value: string): SetHtmlId =>
        createAction('pv/elements/setHtmlId', value, { elementId })

    export const setShowElement = (elementId: ElementId, value: boolean): SetShowElement =>
        createAction('pv/elements/setShowElement', value, { elementId })
}