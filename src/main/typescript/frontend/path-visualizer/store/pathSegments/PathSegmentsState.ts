/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {IdMap} from '@axwt/core'

import {PathSegment, PathSegmentId, PointType} from '../../data'


export interface PathSegmentsState {
    byId: IdMap<PathSegmentId, PathSegment>
    highlightedSegmentId?: PathSegmentId
    highlightedPoint?: PointType
}

export namespace PathSegmentsState {
    export const Default: PathSegmentsState = {
        byId: {},

    }
}