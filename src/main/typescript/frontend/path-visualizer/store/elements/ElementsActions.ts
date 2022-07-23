/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction, UUID} from '@axwt/core'

import {ElementKey, Element, ElementId, ElementType, PathSegment} from '../../data'

export namespace ElementsActions {

    export type ImportPath = Action<'pv/elements/importPath', Element, { newElementId: ElementId, segments: PathSegment[] }>

    export type NewElement = Action<'pv/elements/newElement', Element, { newElementId: ElementId }>

    export type SetCurrentElement = Action<'pv/elements/setCurrentElement', ElementKey>

    export type SetShowElement = Action<'pv/elements/setShowElement', boolean, { elementId: ElementId }>

    export type Any = ImportPath | NewElement | SetCurrentElement | SetShowElement


    export const importPath = (d: string): ImportPath => {
        let segments = PathSegment.parse(d)
        let element = { ... Element.create('path'), segmentIds: segments.map(segment => segment.segmentId) }

        return createAction('pv/elements/importPath', element, { newElementId: element.elementId, segments })
    }

    export const newElement = (elementType: ElementType, newElementId: ElementId = UUID.create()): NewElement =>
        createAction('pv/elements/newElement', Element.create(elementType, newElementId), { newElementId })

    export const setCurrentElement = (elementKey: ElementKey): SetCurrentElement =>
        createAction('pv/elements/setCurrentElement', elementKey)

    export const setShowElement = (elementId: ElementId, value: boolean): SetShowElement =>
        createAction('pv/elements/setShowElement', value, { elementId })
}