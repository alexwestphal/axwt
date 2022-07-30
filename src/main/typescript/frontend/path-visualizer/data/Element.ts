/*
 * Copyright (c) 2022, Alex Westphal.
 */


import {UUID} from '@axwt/core'

import {PathSegmentId} from './PathSegment'
import {PresentationAttributes} from './PresentationAttributes'


export type ElementId = UUID

export type ElementType = 'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect'

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
            case 'ellipse':
                typeSpecificPartial = { cx: 0, cy: 0, rx: 0, ry: 0 }
                break
            case 'line':
                typeSpecificPartial = { x1: 0, y1: 0, x2: 0, y2: 0 }
                break
            case 'path':
                typeSpecificPartial = { segmentIds: [UUID.create()] }
                break
            case 'polygon':
                typeSpecificPartial = { points: [] }
                break
            case 'polyline':
                typeSpecificPartial = { points: [] }
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
    export function isCircle(el: Element): el is Circle {
        return el?.elementType == 'circle'
    }

    export interface Ellipse extends Element {
        cx: number
        cy: number
        rx: number
        ry: number
        pathLength?: number
    }
    export function isEllipse(el: Element): el is Ellipse {
        return el?.elementType == 'ellipse'
    }

    export interface Line extends Element {
        x1: number
        y1: number
        x2: number
        y2: number
        pathLength?: number
    }
    export function isLine(el: Element): el is Line {
        return el?.elementType == 'line'
    }

    export interface Path extends Element {
        segmentIds: PathSegmentId[]
    }
    export function isPath(el: Element): el is Path {
        return el?.elementType == 'path'
    }

    export interface Polygon extends Element {
        points: [number, number][]
        pathLength?: number
    }
    export function isPolygon(el: Element): el is Polygon {
        return el?.elementType == 'polygon'
    }

    export interface Polyline extends Element {
        points: [number, number][]
        pathLength?: number
    }
    export function isPolyline(el: Element): el is Polyline {
        return el?.elementType == 'polyline'
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
    export function isRect(el: Element): el is Rect {
        return el?.elementType == 'rect'
    }
}