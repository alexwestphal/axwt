/*
 * Copyright (c) 2022, Alex Westphal.
 */


import {UUID} from '@axwt/core'

import {PathSegmentId} from './PathSegment'
import {PresentationAttributes} from './PresentationAttributes'


export type ElementId = UUID

export type ElementType = 'circle' | 'path' | 'rect'

export type ElementKey = { elementType: ElementType, elementId: ElementId }

export interface Element {
    elementType: ElementType
    elementId: ElementId

    showElement: boolean

    htmlId: string
    className: string
    style: string
    presentation: PresentationAttributes
}

export namespace Element {
    export const Empty: Omit<Element, 'elementType' | 'elementId'> = {
        showElement: true,

        htmlId: null,
        className: "",
        style: "",
        presentation: {}
    }

    export const create = (elementType: ElementType, elementId: ElementId = UUID.create()): Element => {

        let typeSpecificPartial = {}
        switch (elementType) {
            case 'circle':
                typeSpecificPartial = { cx: 0, cy: 0, r: 0 }
                break
            case 'path':
                typeSpecificPartial = { segmentIds: [UUID.create()] }
                break
            case 'rect':
                typeSpecificPartial = { x: 0, y: 0, width: 0, height: 0 }
                break
        }

        return { elementType, elementId, ...Element.Empty, ...typeSpecificPartial }
    }

    export interface Circle extends Element {
        cx: number
        cy: number
        r: number
        pathLength?: number
    }

    export interface Path extends Element {

        segmentIds: PathSegmentId[]
    }

    export interface Rect extends Element {
        x: number
        y: number
        width: number
        height: number
        rx?: number
        ry?: number
        pathLength?: number
    }
}