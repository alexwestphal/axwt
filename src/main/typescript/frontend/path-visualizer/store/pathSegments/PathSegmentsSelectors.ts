/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {createSelector, Selector} from 'reselect'

import {IdMap} from '@axwt/core'

import {Element, ElementId, PathSegment, PathSegmentHighlight, PathSegmentId, PointType} from '../../data'

import * as PV from '../PV'
import {selectElement} from '../elements'


export const selectSegment: Selector<PV.RootState, PathSegment, [PathSegmentId]> =
    (state, segmentId) => state.pv.pathSegments.byId[segmentId]

export const selectSegmentsMap: Selector<PV.RootState, IdMap<PathSegmentId, PathSegment>> =
    (state) => state.pv.pathSegments.byId

export const selectSegmentsByPath: Selector<PV.RootState, PathSegment[], [ElementId]> = createSelector(
    [selectElement, selectSegmentsMap],
    (path, pathSegmentsById) =>
        (path as Element.Path).segmentIds.map(segmentId => pathSegmentsById[segmentId])
)

export const selectHighlightedSegment: Selector<PV.RootState, PathSegmentHighlight | null> =
    (state) => state.pv.pathSegments.highlight