/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'

import Locale from 'date-fns/locale'

import {Context} from './context'
import {CompiledLanguage} from './language'
import {Phrases} from './modules'


export const useLanguage = (): CompiledLanguage => React.useContext(Context)

/**
 * Return the date-fns locale or null of it's not yet loaded
 */
export const useLocale = (): Locale | null => {
    const {isoCode} = React.useContext(Context)
    const [locale, setLocale] = React.useState<Locale>(null)

    React.useEffect(() => {
        getLocalePromise(isoCode).then(localeModule => { setLocale(localeModule.default) })

    }, [isoCode])

    return locale
}

export const usePhrases = (): Phrases => {
    const language = React.useContext(Context)
    return (language?.compiledPhrases ?? {}) as Phrases
}




const getLocalePromise = (isoCode: string): Promise<{default: Locale}> => {
    switch(isoCode) {
        case 'ar': return import('date-fns/locale/ar')
        case 'cs': return import('date-fns/locale/cs')
        case 'da': return import('date-fns/locale/da')
        case 'de': return import('date-fns/locale/de')
        case 'el': return import('date-fns/locale/el')
        case 'en': return import('date-fns/locale/en-US')
        case 'es':
        case 'es-mx': return import('date-fns/locale/es')
        case 'fr': return import('date-fns/locale/fr')
        case 'fr-ca': return import('date-fns/locale/fr-CA')
        case 'fi': return import('date-fns/locale/fi')
        case 'id': return import('date-fns/locale/id')
        case 'it': return import('date-fns/locale/it')
        case 'ja': return import('date-fns/locale/ja')
        case 'ko':
        case 'ko-kr': return import('date-fns/locale/ko')
        case 'ms': return import('date-fns/locale/ms')
        case 'nb': return import('date-fns/locale/nb')
        case 'nl': return import('date-fns/locale/nl')
        case 'pl': return import('date-fns/locale/pl')
        case 'pt': return import('date-fns/locale/pt')
        case 'pt-br': return import('date-fns/locale/pt-BR')
        case 'ru': return import('date-fns/locale/ru')
        case 'sk': return import('date-fns/locale/sk')
        case 'sv': return import('date-fns/locale/sv')
        case 'th': return import('date-fns/locale/th')
        case 'tr': return import('date-fns/locale/tr')
        case 'vi': return import('date-fns/locale/vi')
        case 'zh':
        case 'zh-cn': return import('date-fns/locale/zh-CN')
        case 'zh-hk': return import('date-fns/locale/zh-HK')

        default: return import('date-fns/locale/en-US') // Default to english if nothing else matches
    }
}