
import {AppOpts} from '@axwt/core/data'
import {Language} from '@axwt/core/i18n'

import {Action, createAction} from '../Action'
import * as Core from '../Core'


export namespace ConfigActions {

    export type LoadAccessToken = Action<'config/loadAccessToken', string>
    export type LoadAppFlags = Action<"config/loadAppFlags", AppOpts>
    export type LoadLanguage = Action<'config/loadLanguage', Language>

    export type SetAppFlag = Action<'config/setAppFlag', boolean, { appFlag: keyof AppOpts }>

    export type Any = LoadAccessToken | LoadAppFlags | LoadLanguage | SetAppFlag

    export const fetchInitData = (): Core.ThunkAction<Promise<void>> =>
        (dispatch, getState, { coreServerAPI }) => {
            return coreServerAPI.getInitData().then(response => {
                dispatch(loadAccessToken(response.accessToken))
                dispatch(loadAppFlags(response.appFlags))
            })
        }

    export const fetchPhrases = (module: string, userLanguage: string): Core.ThunkAction<Promise<void>> =>
        (dispatch, getState, { coreServerAPI }) => {
            return coreServerAPI.getPhrases(module, userLanguage).then(response => {
                dispatch(loadLanguage(response.language))
            })
        }

    export const loadAccessToken = (accessToken: string): LoadAccessToken =>
        createAction('config/loadAccessToken', accessToken)

    export const loadAppFlags = (appFlags: AppOpts): LoadAppFlags => {
        // Check if any of the flags have been overwritten from the console

        let result = { ...appFlags }
        for(let appFlag in appFlags) {
            let storedValue = sessionStorage.getItem(appFlag)
            if(storedValue != null) {
                result[appFlag] = storedValue == 'true'
                console.log(`[AXWT] Using appFlag value set from console ${appFlag}=${storedValue}`)
            }
        }

        return createAction('config/loadAppFlags', result)
    }

    export const loadLanguage = (language: Language): LoadLanguage =>
        createAction('config/loadLanguage', language)

    export const setAppFlag = (appFlag: keyof AppOpts, value: boolean): SetAppFlag => {
        // Cache the set value for the duration of the session
        sessionStorage.setItem(appFlag, value.toString())

        return createAction('config/setAppFlag', value, { appFlag })
    }

}