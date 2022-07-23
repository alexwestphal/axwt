/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

export * from './context'
export * from './language'
export * from './hooks'
export { Phrases } from './modules'



export const PHRASE_TODO = (phraseKey: string, fallback: string) => {
    console.info(`[OPCE] Phrase '${phraseKey}' not yet implemented`)
    return fallback
}