
import {AppOpts} from '@axwt/core/data'

import {Language} from '@axwt/core/i18n'


export interface ConfigState {
    accessToken: string
    appFlags: AppOpts,
    language: Language

}
export namespace ConfigState {
    export const Default: ConfigState = {
        accessToken: null,
        appFlags: null,
        language: null,
    }
}