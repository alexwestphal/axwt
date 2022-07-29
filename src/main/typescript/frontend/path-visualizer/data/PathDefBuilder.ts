

export namespace PathSegmentArray {

    export type EllipticalArc = ['A' | 'a', number, number, number, 0 | 1, 0 | 1, number, number]
    export type CubicBezier = ['C' | 'c', number, number, number, number, number, number]
    export type HorizontalLine = ['H' | 'h', number]
    export type LineTo = ['L' | 'l', number, number]
    export type MoveTo = ['M' | 'm', number, number]
    export type QuadraticBezier = ['Q' | 'q', number, number, number, number]
    export type SmoothCubicBezier = ['S' | 's', number, number, number, number]
    export type SmoothQuadraticBezier = ['T' | 't', number, number]
    export type VerticalLine = ['V' | 'v', number]
    export type ClosePath = ['Z' | 'z']

    export type Any = EllipticalArc | CubicBezier | HorizontalLine | LineTo | MoveTo | QuadraticBezier
        | SmoothCubicBezier | SmoothQuadraticBezier | VerticalLine | ClosePath


}

export const buildPathDef = (x0: number, x1: number): PathDefBuilder => new PathDefBuilder([['M', x0, x1]])


export class PathDefBuilder {

    readonly arrays: PathSegmentArray.Any[]

    constructor(arrays: PathSegmentArray.Any[] = []) {
        this.arrays = arrays
    }

    A(rx: number, ry: number, angle: number, largeArc: 0 | 1, sweep: 0 | 1, x: number, y: number): PathDefBuilder {
        return this.append(['A', rx, ry, angle, largeArc, sweep, x, y])
    }
    a(rx: number, ry: number, angle: number, largeArc: 0 | 1, sweep: 0 | 1, dx: number, dy: number): PathDefBuilder {
        return this.append(['a', rx, ry, angle, largeArc, sweep, dx, dy])
    }
    C(x1: number, y1: number, x2: number, y2: number, x: number, y: number): PathDefBuilder {
        return this.append(['C', x1, y1, x2, y2, x, y])
    }
    c(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): PathDefBuilder {
        return this.append(['c', dx1, dy1, dx2, dy2, dx, dy])
    }
    H(x: number): PathDefBuilder {
        return this.append(['H', x])
    }
    h(dx: number): PathDefBuilder {
        return this.append(['h', dx])
    }
    L(x: number, y: number): PathDefBuilder {
        return this.append(['L', x, y])
    }
    l(dx: number, dy: number): PathDefBuilder {
        return this.append(['l', dx, dy])
    }
    M(x: number, y: number): PathDefBuilder {
        return this.append(['M', x, y])
    }
    m(dx: number, dy: number): PathDefBuilder {
        return this.append(['m', dx, dy])
    }
    Q(x1: number, y1: number, x: number, y: number): PathDefBuilder {
        return this.append(['Q', x1, y1, x, y])
    }
    q(dx1: number, dy1: number, dx: number, dy: number): PathDefBuilder {
        return this.append(['q', dx1, dy1, dx, dy])
    }

    S(x2: number, y2: number, x: number, y: number): PathDefBuilder {
        return this.append(['S', x2, y2, x, y])
    }
    s(dx2: number, dy2: number, dx: number, dy: number): PathDefBuilder {
        return this.append(['s', dx2, dy2, dx, dy])
    }
    T(x: number, y: number): PathDefBuilder {
        return this.append(['T', x, y])
    }
    t(dx: number, dy: number): PathDefBuilder {
        return this.append(['t', dx, dy])
    }
    V(y: number): PathDefBuilder {
        return this.append(['V', y])
    }
    v(dy: number): PathDefBuilder {
        return this.append(['v', dy])
    }
    Z(): PathDefBuilder {
        return this.append(['Z'])
    }
    z(): PathDefBuilder {
        return this.append(['z'])
    }

    private append(array: PathSegmentArray.Any): PathDefBuilder {
        return new PathDefBuilder([...this.arrays, array])
    }

    scale(ratio: number): PathDefBuilder {

        let newArrays: PathSegmentArray.Any[] = this.arrays.map(array => {
            let scaledArray: PathSegmentArray.Any = [...array]
            if(array[0] == 'A' || array[0] == 'a') {
                scaledArray[1] = array[1] * ratio
                scaledArray[2] = array[2] * ratio
                scaledArray[6] = array[6] * ratio
                scaledArray[7] = array[7] * ratio
            } else {
                for(let i=1; i<array.length; i++) {
                    scaledArray[i] = (array[i] as number) * ratio
                }
            }
            return scaledArray
        })
        return new PathDefBuilder(newArrays)
    }

    toString(): string {
        return this.arrays.map(array => array.join(' ')).join(' ')
    }
}