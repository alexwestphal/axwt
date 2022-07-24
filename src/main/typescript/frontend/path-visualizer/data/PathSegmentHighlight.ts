import {PathSegmentId, PointType} from './PathSegment'


export interface PathSegmentHighlight {
    segmentId: PathSegmentId
    pointType: PointType | null

    largeArc?: boolean
    sweep?: boolean
}