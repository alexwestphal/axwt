/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction, UUID} from '@axwt/core'

import {PathSegment, PathSegmentId, PathSegmentSymbol, ElementId, PathSegmentHighlight} from '../../data'


export namespace PathSegmentsActions {

    export type DeleteSegment = Action<'pv/pathSegments/deleteSegment', null, { pathId: ElementId, segmentId: PathSegmentId }>

    export type NewSegment = Action<'pv/pathSegments/newSegment', PathSegment, { pathId: ElementId, newPathSegmentId: PathSegmentId }>

    export type SetArgValue = Action<'pv/pathSegments/setArgValue', number, { segmentId: PathSegmentId, argName: string }>

    export type SetCommand = Action<'pv/pathsSegments/setCommand', PathSegmentSymbol, { segmentId: PathSegmentId }>

    export type SelectHighlight = Action<'pv/pathSegments/selectHighlight', PathSegmentHighlight>

    export type Any = DeleteSegment | NewSegment | SetArgValue | SetCommand | SelectHighlight


    export const deleteSegment = (pathId: ElementId, segmentId: PathSegmentId): DeleteSegment =>
        createAction('pv/pathSegments/deleteSegment', null, { pathId, segmentId })

    export const newSegment = (pathId: ElementId): NewSegment => {
        let segmentId = UUID.create()
        let pathSegment: PathSegment = { segmentId, command: 'M', arguments: { x: 0, y: 0 }, implicit: false }
        return createAction('pv/pathSegments/newSegment', pathSegment, { pathId, newPathSegmentId: segmentId })
    }

    export const setArgValue = (segmentId: PathSegmentId, argName: string, argValue: number): SetArgValue =>
        createAction('pv/pathSegments/setArgValue', argValue, { segmentId, argName })

    export const setCommand = (segmentId: PathSegmentId, symbol: PathSegmentSymbol): SetCommand =>
        createAction('pv/pathsSegments/setCommand', symbol, { segmentId })

    export const selectHighlight = (highlight: PathSegmentHighlight): SelectHighlight =>
        createAction('pv/pathSegments/selectHighlight', highlight)
}