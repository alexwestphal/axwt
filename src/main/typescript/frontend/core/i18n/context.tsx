/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'
import {CompiledLanguage, compileLanguage, Language} from './language'


export const Context = React.createContext<CompiledLanguage>(null)


export type ProviderProps = React.PropsWithChildren<{
    language: Language
}>

export const Provider: React.FC<ProviderProps> = ({language, children}) => {
    // We only want to compile the language when it changes
    const compiledLanguage = React.useMemo(() => compileLanguage(language), [language])

    return <Context.Provider value={compiledLanguage}>{children}</Context.Provider>
}