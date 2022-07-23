/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'

import {Phrase} from './language'


/**
 * Compile a phrase into a phrase function
 */
export const compilePhrase = (phraseKey: string, rawPhrase: string): Phrase => {
    let parts: string[] = []
    let argIndices: number[] = []
    let li = 0, inBraces = false
    for(let i=0; i<rawPhrase.length; i++) {
        if(inBraces) {
            switch(rawPhrase[i]) {
                case '{':
                    throw new PhraseCompilerError(`Unexpected symbol '{' at index=${i}`, rawPhrase)
                case '}':
                    let indexStr = rawPhrase.slice(li, i).trim()
                    let index = parseInt(indexStr)
                    if(isNaN(index)) throw new PhraseCompilerError(`Invalid parameter '${indexStr}'`, rawPhrase)
                    argIndices.push(index)
                    li = i+1
                    inBraces = false
                    break
            }
        } else {
            switch(rawPhrase[i]) {
                case '{':
                    parts.push(rawPhrase.slice(li, i))
                    li = i+1
                    inBraces = true
                    break
                case '}':
                    throw new PhraseCompilerError(`Unexpected symbol '{' at index=${i}`, rawPhrase)
                case '\\':
                    if(i+1 <rawPhrase.length && rawPhrase[i]+1 == '{') i++ // Check for an escaped open brace
                    break
            }
        }
    }
    if(inBraces) {
        throw new PhraseCompilerError(`Unclosed interpolation`, rawPhrase)
    } else {
        parts.push(rawPhrase.slice(li))
    }

    let interpolate = parts.length > 1
        ? (...args) => {
            let result = "", i = 0
            while(i < argIndices.length) {
                let argIndex = argIndices[i]
                let arg = argIndex < args.length ? args[argIndex] : `MISSING_ARG${argIndex}`
                result += parts[i] + arg
                i++
            }
            result += parts[i]
            return result
        }
        : () => parts[1]

    let interpolateReact = parts.length > 1
        ? (...args): React.ReactNode => {
            let result = [], i = 0
            while(i < argIndices.length) {
                let argIndex = argIndices[i]
                let arg = argIndex < args.length ? args[argIndex]: `MISSING_ARG${argIndex}`
                result.push(parts[i], arg)
                i++
            }
            result.push(parts[i])
            return result
        }
        : (): React.ReactNode => parts[1]

    return Object.assign(rawPhrase, { phraseKey, interpolate, interpolateReact })
}

export const createMissingPhrase = (phraseKey: string): Phrase => {
    registerMissingPhrase(phraseKey)
    let fakeRaw = `???${phraseKey}???`
    return Object.assign(fakeRaw, { phraseKey, interpolate: () => fakeRaw, interpolateReact: () => fakeRaw })
}

export class PhraseCompilerError extends Error {
    readonly phrase: string;
    constructor(errorMessage: string, phrase: string) {
        super(errorMessage +  `in message '${phrase}'`)
        this.name = "I18nMessageCompilerError"
        this.phrase = phrase
    }
}


const missingPhraseList: string[] = []

const registerMissingPhrase = (phraseKey: string) => {
    if(missingPhraseList.includes(phraseKey)) return

    missingPhraseList.push(phraseKey)
    console.log(`Missing phrase: ${phraseKey}`)
}
