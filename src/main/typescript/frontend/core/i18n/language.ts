/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'

import {compilePhrase, createMissingPhrase} from './compile'

/**
 * ISO 639-1 code of the language
 */
export type ISOLanguageCode = string

export type OPLSLanguageCode = number


export type Phrase<
    // There are either 0 params, or N params
    Args extends never | readonly any[] = any[]
> = string & {
    phraseKey: string,
    interpolate: ([Args] extends [never] ? () => string : (...args: Args) => string),
    interpolateReact: ([Args] extends [never] ? () => React.ReactNode : (...args: Args) => React.ReactNode),
}

export interface Language {
    readonly isoCode: ISOLanguageCode
    readonly oplsCode: OPLSLanguageCode
    readonly displayName: string
    readonly phrases: { [key: string]: string }
}

export interface CompiledLanguage extends Language {
    readonly compiledPhrases: { [key: string]: Phrase }

    readonly isEnglish: boolean
    readonly isFrench: boolean
}

export const compileLanguage = (language: Language): CompiledLanguage => {
    if(null == language) return null

    let compiledPhrases: CompiledLanguage['compiledPhrases'] = {}


    for(let key in language.phrases) {
        compiledPhrases[key] = compilePhrase(key, language.phrases[key])
    }

    let compiledPhrasesProxy = new Proxy(compiledPhrases, {
        get: function(target, phraseKey) {

            if(typeof phraseKey === 'symbol'){
                return Reflect.get(target, phraseKey)
            }

            return target[phraseKey] ?? createMissingPhrase(phraseKey)
        }
    })

    return { ...language,
        compiledPhrases: compiledPhrasesProxy,
        isEnglish: language.isoCode.startsWith("en"),
        isFrench: language.isoCode.startsWith("fr")
    }
}