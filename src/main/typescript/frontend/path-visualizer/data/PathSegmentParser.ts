/*
 * Copyright (c) 2022, Alex Westphal.
 */


import PathSegment, {
    ClosePathAbsolute, ClosePathRelative,
    CubicBezierAbsolute,
    CubicBezierRelative,
    EllipticalArcAbsolute,
    EllipticalArcRelative,
    HorizontalLineAbsolute,
    HorizontalLineRelative,
    LineToAbsolute,
    LineToRelative,
    MoveToAbsolute,
    MoveToRelative,
    PathSegmentSymbol, QuadraticBezierAbsolute, QuadraticBezierRelative,
    SmoothCubicBezierAbsolute, SmoothCubicBezierRelative, SmoothQuadraticBezierAbsolute, SmoothQuadraticBezierRelative,
    VerticalLineAbsolute,
    VerticalLineRelative
} from './PathSegment'
import {ArrayUtils} from '@axwt/util'

export class PathSegmentParser {

    source: string
    options: PathSegmentParserOptions

    private currentIndex: number = 0
    private tokenStartIndex: number = 0

    private tokens: Token[] = []
    private tokenIndex: number = 0

    constructor(source: string, options: PathSegmentParserOptions = {}) {
        this.source = source
        this.options = options
    }

    private get atEnd(): boolean { return this.currentIndex == this.source.length }

    parse(): PathSegment[] {
        this.tokenize()


        let commands: PathSegment[] = []
        let command: PathSegment[]
        while(command = this.buildCommand()) {
            commands.push(...command)
        }

        return commands
    }



    private tokenize() {
        let token: Token
        while(token = this.nextToken()) this.tokens.push(token)

        if(this.options.verbose) console.debug("Tokens: ", this.tokens.map(token => token.value))
    }

    private nextToken(): Token {
        let s = ""

        this.tokenStartIndex = this.currentIndex

        while(true) {
            if(this.atEnd) break // End of source

            let c = this.source[this.currentIndex]

            if(c == ' ' || c == ',') {
                if (s.length > 0) break // End of token
                else { // Whitespace ahead of token
                    this.currentIndex += 1
                    this.tokenStartIndex = this.currentIndex
                }
            } else if(c == '-') {
                if(s.length > 0) break // End of current token
                else {
                    s = '-'
                    this.currentIndex += 1
                }
            } else if(isCommandLetter(c)) {
                if(s.length == 0) { // Valid letter token
                    let token: LetterToken = { type: 'letter', index: this.currentIndex, value: c as PathSegmentSymbol }
                    this.currentIndex += 1
                    return token
                } else break // End of token
            } else if(isDigit(c) || c == '.') {
                s += c
                this.currentIndex += 1
            } else { // Unrecognised character
                if(this.options.ignoreExtraCharacters) this.currentIndex += 1
                else if(s.length > 0) break // End the current token
                else throw new PathSegmentParserError(this.currentIndex, `Unrecognised symbol '${c}'`)
            }
        }

        if(s.length == 0) return null // No next token
        else if(s == '-') {
            if(this.atEnd) throw new PathSegmentParserError(this.currentIndex, `Unexpected end of input`)
            else throw new PathSegmentParserError(this.currentIndex, `Unexpected symbol '${this.source[this.currentIndex]}' expected digit`)
        } else  {
            let number = parseFloat(s)
            if(isNaN(number)) {
                throw new PathSegmentParserError(this.tokenStartIndex, `Unable to parse token '${s}' as number`)
            } else {
                return { type: 'number', index: this.tokenStartIndex, value: number }
            }
        }
    }

    private buildCommand(): PathSegment[] {

        if(this.tokenIndex == this.tokens.length) return null // At end

        let commandToken: Token = this.tokens[this.tokenIndex++]
        if(this.options.ignoreExtraArguments) {
            // Skip non-letter tokens
            while(commandToken.type != 'letter' && this.tokenIndex < this.tokens.length) commandToken = this.tokens[this.tokenIndex++]
        }
        if(this.tokenIndex == this.tokens.length) return null // At end

        if(commandToken.type != 'letter') { // Not the start of a command
            throw new PathSegmentParserError(commandToken.index, `Unexpected token '${commandToken.value}' expected command`)
        }

        switch(commandToken.value) {
            case 'A': {
                const createPartial = (args: NumberToken[]): PathSegment.ArgumentType<EllipticalArcAbsolute> => {
                    let [{ value: rx }, { value: ry }, { value: angle}, largeArcFlagToken, sweepFlagToken, { value: x }, { value: y }] = args
                    let largeArcFlag: 0 | 1
                    if(largeArcFlagToken.value < 0 || largeArcFlagToken.value > 1) {
                        if(this.options.coerceFlags) largeArcFlag = largeArcFlagToken.value ? 1 : 0
                        else throw new PathSegmentParserError(largeArcFlagToken.index, `Invalid large-arc-flag '${largeArcFlagToken.value}' export 0 or 1`)
                    }
                    let sweepFlag: 0 | 1
                    if(sweepFlagToken.value < 0 || sweepFlagToken.value > 1) {
                        if(this.options.coerceFlags) sweepFlag = sweepFlagToken.value ? 1 : 0
                        else throw new PathSegmentParserError(sweepFlagToken.index, `Invalid sweep '${sweepFlagToken.value}' export 0 or 1`)
                    }

                    return { rx, ry, angle, largeArcFlag, sweepFlag, x, y }
                }

                let args = this.consumeArguments(commandToken, 7)
                let partials = ArrayUtils.range(0, args.length, 7).map(i => createPartial(args.slice(i, i+7)))
                return PathSegment.create<EllipticalArcAbsolute>('A', partials)

            }
            case 'a': {
                const createPartial = (args: NumberToken[]): PathSegment.ArgumentType<EllipticalArcRelative> => {
                    let [{ value: rx }, { value: ry }, { value: angle}, largeArcFlagToken, sweepFlagToken, { value: dx }, { value: dy }] = args
                    let largeArcFlag: 0 | 1
                    if(largeArcFlagToken.value < 0 || largeArcFlagToken.value > 1) {
                        if(this.options.coerceFlags) largeArcFlag = largeArcFlagToken.value ? 1 : 0
                        else throw new PathSegmentParserError(largeArcFlagToken.index, `Invalid large-arc-flag '${largeArcFlagToken.value}' export 0 or 1`)
                    }
                    let sweepFlag: 0 | 1
                    if(sweepFlagToken.value < 0 || sweepFlagToken.value > 1) {
                        if(this.options.coerceFlags) sweepFlag = sweepFlagToken.value ? 1 : 0
                        else throw new PathSegmentParserError(sweepFlagToken.index, `Invalid sweep '${sweepFlagToken.value}' export 0 or 1`)
                    }

                    return { rx, ry, angle, largeArcFlag, sweepFlag, dx, dy }
                }

                let args = this.consumeArguments(commandToken, 7)
                let partials = ArrayUtils.range(0, args.length, 7).map(i => createPartial(args.slice(i, i+7)))
                return PathSegment.create<EllipticalArcRelative>('a', partials)
            }
            case 'C':
                return PathSegment.create<CubicBezierAbsolute>('C',
                    this.consumeAndMapArgs(commandToken, 6, ([x1, y1, x2, y2, x, y]) => ({ x1, y1, x2, y2, x, y }))
                )
            case 'c':
                return PathSegment.create<CubicBezierRelative>('c',
                    this.consumeAndMapArgs(commandToken, 6, ([dx1, dy1, dx2, dy2, dx, dy]) => ({ dx1, dy1, dx2, dy2, dx, dy }))
                )
            case 'H':
                return PathSegment.create<HorizontalLineAbsolute>('H',
                    this.consumeAndMapArgs(commandToken, 1, ([x]) => ({ x }))
                )
            case 'h':
                return PathSegment.create<HorizontalLineRelative>('h',
                    this.consumeAndMapArgs(commandToken, 1, ([dx]) => ({ dx }))
                )
            case 'L':
                return PathSegment.create<LineToAbsolute>('L',
                    this.consumeAndMapArgs(commandToken, 2, ([x, y]) => ({ x, y }))
                )
            case 'l':
                return PathSegment.create<LineToRelative>('l',
                    this.consumeAndMapArgs(commandToken, 2, ([dx, dy]) => ({ dx, dy }))
                )
            case 'M':
                return PathSegment.create<MoveToAbsolute>('M',
                    this.consumeAndMapArgs(commandToken, 2, ([x, y]) => ({ x, y }))
                )
            case 'm':
                return PathSegment.create<MoveToRelative>('m',
                    this.consumeAndMapArgs(commandToken, 2, ([dx, dy]) => ({ dx, dy }))
                )
            case 'Q':
                return PathSegment.create<QuadraticBezierAbsolute>('Q',
                    this.consumeAndMapArgs(commandToken, 4, ([x1, y1, x, y]) => ({ x1, y1, x, y }))
                )
            case 'q':
                return PathSegment.create<QuadraticBezierRelative>('q',
                    this.consumeAndMapArgs(commandToken, 4, ([dx1, dy1, dx, dy]) => ({ dx1, dy1, dx, dy }))
                )
            case 'S':
                return PathSegment.create<SmoothCubicBezierAbsolute>('S',
                    this.consumeAndMapArgs(commandToken, 4, ([x2, y2, x, y]) => ({ x2, y2, x, y }))
                )
            case 's':
                return PathSegment.create<SmoothCubicBezierRelative>('s',
                    this.consumeAndMapArgs(commandToken, 4, ([dx2, dy2, dx, dy]) => ({ dx2, dy2, dx, dy }))
                )
            case 'T':
                return PathSegment.create<SmoothQuadraticBezierAbsolute>('T',
                    this.consumeAndMapArgs(commandToken, 2, ([x, y]) => ({ x, y }))
                )
            case 't':
                return PathSegment.create<SmoothQuadraticBezierRelative>('t',
                    this.consumeAndMapArgs(commandToken, 2, ([dx, dy]) => ({ dx, dy }))
                )
            case 'V':
                return PathSegment.create<VerticalLineAbsolute>('V',
                    this.consumeAndMapArgs(commandToken, 1, ([y]) => ({ y }))
                )
            case 'v':
                return PathSegment.create<VerticalLineRelative>('v',
                    this.consumeAndMapArgs(commandToken, 1, ([dy]) => ({ dy }))
                )
            case 'Z':
                return PathSegment.create<ClosePathAbsolute>('Z', [])
            case 'z':
                return PathSegment.create<ClosePathRelative>('z', [])

        }
    }


    private consumeArguments(commandToken: Token, n: number): NumberToken[] {
        let tokens = []
        let token: Token
        while(this.tokenIndex < this.tokens.length
            && (token = this.tokens[this.tokenIndex])
            && token.type == 'number'
        ) {
            tokens.push(token)
            this.tokenIndex++
        }

        // Should be at least n tokens
        if(tokens.length < n) {
            throw new PathSegmentParserError(commandToken.index, `Not enough arguments for command ${commandToken.value} expected ${n}`)
        }
        if(tokens.length % n != 0) {
            // Not a multiple of n
            if(this.options.ignoreExtraArguments) tokens = tokens.slice(0, tokens.length - tokens.length % n)
            else throw new PathSegmentParserError(commandToken.index, `Incorrect number of arguments for command ${commandToken.value} expected multiple of ${n}`)
        }

        return tokens
    }

    private  consumeAndMapArgs<A>(commandToken: Token, n: number, f: (args: number[]) => A): A[] {
        let args = this.consumeArguments(commandToken, n).map(token => token.value)
        return ArrayUtils.range(0, args.length, n).map(i => f(args.slice(i, i+n)))
    }
}

export interface PathSegmentParserOptions {
    coerceFlags?: boolean
    ignoreExtraCharacters?: boolean
    ignoreExtraArguments?: boolean
    verbose?: boolean
}

export interface LetterToken {
    type: 'letter'
    index: number
    value: PathSegmentSymbol
}

export interface NumberToken {
    type: 'number'
    index: number
    value: number
}

export type Token = LetterToken | NumberToken

export class PathSegmentParserError extends Error {

    readonly index: number
    readonly message: string

    constructor(index: number, message: string) {
        super(`${message} at index ${index}`)
        this.index = index
        this.message = message
    }

}

const isCommandLetter = (c: string): boolean => {
    if(c.length == 0 || c.length > 1) throw new Error(`Expect single character as argument, received: '${c}'`)

    return "AaCcHhLlMmQqSsTtVvZz".indexOf(c) >= 0
}

const isDigit = (c: string): boolean => {
    if(c.length == 0 || c.length > 1) throw new Error(`Expect single character as argument, received: '${c}'`)

    return '0' <= c && c <= '9'
}