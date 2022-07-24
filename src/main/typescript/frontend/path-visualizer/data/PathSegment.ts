/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {UUID} from '@axwt/core'
import {PathDefinitionParser, PathDefinitionParserOptions} from './PathDefinitionParser'

export type PathSegmentId = UUID

export type PathSegmentSymbol = 'A'|'a'|'C'|'c'|'H'|'h'|'L'|'l'|'M'|'m'|'Q'|'q'|'S'|'s'|'T'|'t'|'V'|'v'|'Z'|'z'

export type Point = [number, number]

export type PointType = 'StartControl' | 'EndControl' | 'End'

export interface DerivedArguments {
    x0: number
    y0: number
    x1?: number
    y1?: number
    x2?: number
    y2?: number
    x: number
    y: number
    startPointReflects?: { segmentId: PathSegmentId, pointType: PointType }
}

export type PathSegmentBase<C extends PathSegmentSymbol, A> = {
    segmentId: PathSegmentId
    command: C
    arguments: A
    implicit: boolean
}

export type MoveToAbsolute = PathSegmentBase<'M', { x: number, y: number }>
export type MoveToRelative = PathSegmentBase<'m', { dx: number, dy: number }>

export type LineToAbsolute = PathSegmentBase<'L', { x: number, y: number }>
export type LineToRelative = PathSegmentBase<'l', { dx: number, dy: number }>

export type HorizontalLineAbsolute = PathSegmentBase<'H', { x: number }>
export type HorizontalLineRelative = PathSegmentBase<'h', { dx: number }>

export type VerticalLineAbsolute = PathSegmentBase<'V', { y: number }>
export type VerticalLineRelative = PathSegmentBase<'v', { dy: number }>

export type CubicBezierAbsolute = PathSegmentBase<'C', {
    x1: number
    y1: number
    x2: number
    y2: number
    x: number
    y: number
}>
export type CubicBezierRelative = PathSegmentBase<'c', {
    dx1: number
    dy1: number
    dx2: number
    dy2: number
    dx: number
    dy: number
}>

export type SmoothCubicBezierAbsolute = PathSegmentBase<'S', {
    x2: number
    y2: number
    x: number
    y: number
}>
export type SmoothCubicBezierRelative = PathSegmentBase<'s', {
    dx2: number
    dy2: number
    dx: number
    dy: number
}>

export type QuadraticBezierAbsolute = PathSegmentBase<'Q', {
    x1: number
    y1: number
    x: number
    y: number
}>
export type QuadraticBezierRelative = PathSegmentBase<'q', {
    dx1: number
    dy1: number
    dx: number
    dy: number
}>

export type SmoothQuadraticBezierAbsolute = PathSegmentBase<'T', { x: number, y: number }>
export type SmoothQuadraticBezierRelative = PathSegmentBase<'t', { dx: number, dy: number }>


export type EllipticalArcAbsolute = PathSegmentBase<'A', {
    rx: number
    ry: number
    angle: number
    largeArc: 0 | 1
    sweep: 0 | 1
    x: number
    y: number
}>

export type EllipticalArcRelative = PathSegmentBase<'a', {
    rx: number
    ry: number
    angle: number
    largeArc: 0 | 1
    sweep: 0 | 1
    dx: number
    dy: number
}>

export type ClosePathAbsolute = PathSegmentBase<'Z', {}>

export type ClosePathRelative = PathSegmentBase<'z', {}>

export type PathSegment = MoveToAbsolute | MoveToRelative | LineToAbsolute | LineToRelative
    | HorizontalLineAbsolute | HorizontalLineRelative | VerticalLineAbsolute | VerticalLineRelative
    | CubicBezierAbsolute | CubicBezierRelative | SmoothCubicBezierAbsolute | SmoothCubicBezierRelative
    | QuadraticBezierAbsolute | QuadraticBezierRelative | SmoothQuadraticBezierAbsolute | SmoothQuadraticBezierRelative
    | EllipticalArcAbsolute | EllipticalArcRelative | ClosePathAbsolute | ClosePathRelative


export namespace PathSegment {

    export type SymbolType<P> = P extends PathSegmentBase<infer C, any> ? C : never
    export type ArgumentType<P> = P extends PathSegmentBase<any, infer A> ? A : never


    export const create = <P extends PathSegmentBase<any, any>>(command: SymbolType<P>, argsArray: ArgumentType<P>[]): PathSegment[] =>
        argsArray.map((args, argsIndex) => {
            return { segmentId: UUID.create(), command: command, arguments: args, implicit: argsIndex > 0 }
        })

    export const parse = (source: string, options: PathDefinitionParserOptions = {}): PathSegment[] => new PathDefinitionParser(source, options).parse()

    export const toString = (segments: PathSegment | PathSegment[]): string =>
        Array.isArray(segments) ? segments.flatMap(buildSegment).join(' ') : buildSegment(segments).join(' ')

    const buildSegment = (segment: PathSegment): any[] => {
        let result: any[] = [segment.command]
        switch (segment.command) {
            case 'A':
                for(let { rx, ry, angle, largeArc, sweep, x,y } of [segment.arguments])
                    result.push(`${rx} ${ry} ${angle} ${largeArc} ${sweep} ${x},${y}`)
                break
            case 'a':
                for(let { rx, ry, angle, largeArc, sweep, dx,dy } of [segment.arguments])
                    result.push(`${rx} ${ry} ${angle} ${largeArc} ${sweep} ${dx},${dy}`)
                break
            case 'C':
                for(let { x1,y1, x2,y2, x,y } of [segment.arguments])
                    result.push(`${x1},${y1} ${x2},${y2} ${x},${y}`)
                break
            case 'c':
                for(let { dx1,dy1, dx2,dy2, dx,dy } of [segment.arguments])
                    result.push(`${dx1},${dy1} ${dx2},${dy2} ${dx},${dy}`)
                break
            case 'H':
                for(let { x } of [segment.arguments])
                    result.push(`${x}`)
                break
            case 'h':
                for(let { dx } of [segment.arguments])
                    result.push(`${dx}`)
                break
            case 'L':
                for(let { x, y } of [segment.arguments])
                    result.push(`${x},${y}`)
                break
            case 'l':
                for(let { dx,dy } of [segment.arguments])
                    result.push(`${dx},${dy}`)
                break
            case 'M':
                for(let { x, y } of [segment.arguments])
                    result.push(`${x},${y}`)
                break
            case 'm':
                for(let { dx,dy } of [segment.arguments])
                    result.push(`${dx},${dy}`)
                break
            case 'Q':
                for(let { x1,y1, x,y } of [segment.arguments])
                    result.push(`${x1},${y1} ${x},${y}`)
                break
            case 'q':
                for(let { dx1,dy1, dx,dy } of [segment.arguments])
                    result.push(`${dx1},${dy1} ${dx},${dy}`)
                break
            case 'S':
                for(let { x2,y2, x,y } of [segment.arguments])
                    result.push(`${x2},${y2} ${x},${y}`)
                break
            case 's':
                for(let { dx2,dy2, dx,dy } of [segment.arguments])
                    result.push(`${dx2},${dy2} ${dx},${dy}`)
                break
            case 'T':
                for(let { x, y } of [segment.arguments])
                    result.push(`${x},${y}`)
                break
            case 't':
                for(let { dx,dy } of [segment.arguments])
                    result.push(`${dx},${dy}`)
                break
            case 'V':
                for(let { y } of [segment.arguments])
                    result.push(`${y}`)
                break
            case 'v':
                for(let { dy } of [segment.arguments])
                    result.push(`${dy}`)
                break
            default:
                for(let {} of [segment.arguments])
                    result.push('')
                break
        }
        return result
    }

    export type PathSegmentWithDerivedValues = PathSegment & { derived: DerivedArguments}
    export const withDerivedValues = (segments: PathSegment[], origin: Point = [0, 0]): PathSegmentWithDerivedValues[] => {
        let result: PathSegmentWithDerivedValues[] = []

        let x0 = origin[0], y0 = origin[1]

        let segment0 = segments[0]
        let firstPoint = segment0.command == 'M'
            ? [segment0.arguments.x, segment0.arguments.y]
            : segment0.command == 'm'
                ? [x0 + segment0.arguments.dx, y0 + segment0.arguments.dy]
                : origin
        let prevSegment: PathSegmentWithDerivedValues

        for(let segment of segments) {
            let x, y, x1: number, y1: number, x2: number, y2: number


            //result.push({ ...segment, derived })
            switch(segment.command) { // calculate how the start point should change for the next segment
                case 'A':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    break
                case 'a':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    break
                case 'C':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    x1 = segment.arguments.x1
                    y1 = segment.arguments.y1
                    x2 = segment.arguments.x2
                    y2 = segment.arguments.y2
                    break
                case 'c':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    x1 = x0 + segment.arguments.dx1
                    y1 = y0 + segment.arguments.dy1
                    x2 = x0 + segment.arguments.dx2
                    y2 = y0 + segment.arguments.dy2
                    break
                case 'H':
                    x = segment.arguments.x
                    y = y0
                    break
                case 'h':
                    x = x0 + segment.arguments.dx
                    y = y0
                    break
                case 'L':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    break
                case 'l':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    break
                case 'M':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    break
                case 'm':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    break
                case 'Q':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    x1 = segment.arguments.x1
                    y1 = segment.arguments.y1
                    break
                case 'q':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    x1 = x0 + segment.arguments.dx1
                    y1 = y0 + segment.arguments.dy1
                    break
                case 'S':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    x2 = segment.arguments.x2
                    y2 = segment.arguments.y2
                    break
                case 's':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    x2 = x0 + segment.arguments.dx2
                    y2 = y0 + segment.arguments.dy2
                    break
                case 'T':
                    x = segment.arguments.x
                    y = segment.arguments.y
                    break
                case 't':
                    x = x0 + segment.arguments.dx
                    y = y0 + segment.arguments.dy
                    break

                case 'V':
                    x = x0
                    y = segment.arguments.y
                    break
                case 'v':
                    x = x0
                    y = y0 + segment.arguments.dy
                    break
                case 'Z':
                case 'z':
                    x = firstPoint[0]
                    y = firstPoint[1]
                    break
            }

            let startPointReflects: DerivedArguments['startPointReflects']
            if(segment.command == 'S' || segment.command == 's') {
                // This segment is a smooth cubic bézier curve, need to derive the start control point
                if(prevSegment && "CcSs".indexOf(prevSegment.command) >= -1) {
                    // Previous segment was also a cubic bézier curve, so start control point is a reflection of the end
                    // control point of the one
                    x1 = 2*x0 - prevSegment.derived.x2
                    y1 = 2*y0 - prevSegment.derived.y2
                    startPointReflects = { segmentId: prevSegment.segmentId, pointType: 'EndControl' }
                } else {
                    // Use the starting point as the control point
                    x1 = x0
                    y1 = y0
                }
            }

            if(segment.command == 'T' || segment.command == 't') {
                // This segment is a smooth quadratic bézier curve, need to derive the control point
                if(prevSegment && "QqTt".indexOf(prevSegment.command) >= -1) {
                    // Previous segment was also a quadratic bézier curve, so control point is a reflection of that one
                    x1 = 2*x0 - prevSegment.derived.x1
                    y1 = 2*y0 - prevSegment.derived.y1
                    startPointReflects = {segmentId: prevSegment.segmentId, pointType: 'StartControl' }
                } else {
                    // Use the starting point as the control point
                    x1 = x0
                    y1 = y0
                }
            }

            result.push(prevSegment = { ...segment, derived: { x0, y0, x, y, x1, y1, x2, y2, startPointReflects }})

            // The x,y is the x0,y0 of the next segment
            x0 = x
            y0 = y
        }

        return result
    }

    export const argumentNamesByType = {
        A: ['rx', 'ry', 'angle', 'largeArc', 'sweep', 'x', 'y'],
        a: ['rx', 'ry', 'angle', 'largeArc', 'sweep', 'dx', 'dy'],
        C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
        c: ['dx1', 'dy1', 'dx2', 'dy2', 'dx', 'dy'],
        H: ['x'],
        h: ['dx'],
        L: ['x', 'y'],
        l: ['dx', 'dy'],
        M: ['x', 'y'],
        m: ['dx', 'dy'],
        Q: ['x1', 'y1', 'x', 'y'],
        q: ['dx1', 'dy1', 'dx', 'dy'],
        S: ['x2', 'y2', 'x', 'y'],
        s: ['dx2', 'dy2', 'dx', 'dy'],
        T: ['x', 'y'],
        t: ['dx', 'dy'],
        V: ['y'],
        v: ['dy'],
        Z: [],
        z: []
    }

    export const convert = (segment: PathSegment, newCommand: PathSegmentSymbol): PathSegment => {
        let args = segment.arguments
        let newArgs = {}

        for(let argName of argumentNamesByType[newCommand]) {
            switch(argName) {
                case 'x':
                    newArgs['x'] = args['x'] ?? args['dx'] ?? 0
                    break
                case 'x1':
                    newArgs['x1'] = args['x1'] ?? args['dx1'] ?? 0
                    break
                case 'x2':
                    newArgs['x2'] = args['x2'] ?? args['dx2'] ?? 0
                    break
                case 'dx':
                    newArgs['dx'] = args['dx'] ?? args['x'] ?? 0
                    break
                case 'dx1':
                    newArgs['dx1'] = args['dx1'] ?? args['x1'] ?? 0
                    break
                case 'dx2':
                    newArgs['dx2'] = args['dx2'] ?? args['x2'] ?? 0
                    break
                case 'y':
                    newArgs['y'] = args['y'] ?? args['dy'] ?? 0
                    break
                case 'y1':
                    newArgs['y1'] = args['y1'] ?? args['dy1'] ?? 0
                    break
                case 'y2':
                    newArgs['y2'] = args['y2'] ?? args['dy2'] ?? 0
                    break
                case 'dy':
                    newArgs['dy'] = args['dy'] ?? args['y'] ?? 0
                    break
                case 'dy1':
                    newArgs['dy1'] = args['dy1'] ?? args['y1'] ?? 0
                    break
                case 'dy2':
                    newArgs['dy2'] = args['dy2'] ?? args['y2'] ?? 0
                    break
                default:
                    newArgs[argName] = args[argName] ?? 0
                    break
            }
        }

        return { segmentId: segment.segmentId, command: newCommand, arguments: newArgs, implicit: segment.implicit} as PathSegment
    }


}


export default PathSegment
