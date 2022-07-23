
import {Selector} from 'reselect'

import {AppOpts} from '@axwt/core/data'
import {Language} from '@axwt/core/i18n'

import * as Core from '../Core'


export const selectAccessToken: Selector<Core.State, string> = (state) => state.config.accessToken

export const selectAppFlags: Selector<Core.State, AppOpts> = (state) => state.config.appFlags

export const selectLanguage: Selector<Core.State, Language> = (state) => state.config.language