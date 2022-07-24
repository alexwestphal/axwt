/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {IdMap} from '@axwt/core'

import {PathSegment, PathSegmentHighlight, PathSegmentId} from '../../data'


export interface PathSegmentsState {
    byId: IdMap<PathSegmentId, PathSegment>
    highlight: PathSegmentHighlight | null
}

export namespace PathSegmentsState {
    export const Default: PathSegmentsState = {
        byId: {},
        highlight: null
    }
}