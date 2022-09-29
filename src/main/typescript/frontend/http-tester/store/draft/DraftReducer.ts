
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as HT from '../HT'

import {Request, QueryParameter, RequestHeader} from '../../data'

import {DraftState} from './DraftState'



export const DraftReducer: Reducer<DraftState> = produce((draft: Draft<DraftState>, action: HT.AnyAction) => {
    switch (action.type) {
        case 'ht/draft/deleteHeader':
            draft.current.headers.splice(action.meta.headerIndex, 1)
            draft.current.dirty = true
            break
        case 'ht/draft/deleteQueryParam':
            draft.current.queryParameters.splice(action.meta.paramIndex, 1)
            updateUrlFromQueryParams(draft.current)
            draft.current.dirty = true
            break
        case 'ht/draft/newHeader':
            draft.current.headers.push(RequestHeader.Default)
            draft.current.dirty = true
            break
        case 'ht/draft/newQueryParam':
            draft.current.queryParameters.push(QueryParameter.Default)
            draft.current.dirty = true
            break
        case 'ht/draft/newDraft':
            draft.current = {...action.payload, saved: false, dirty: false}
            break
        case 'ht/draft/setHeaderInclude':
            draft.current.headers[action.meta.headerIndex].include = action.payload
            draft.current.dirty = true
            break
        case 'ht/draft/setHeaderName':
            draft.current.headers[action.meta.headerIndex].name = action.payload
            draft.current.dirty = true
            break
        case 'ht/draft/setHeaderValue':
            draft.current.headers[action.meta.headerIndex].value = action.payload
            draft.current.dirty = true
            break
        case 'ht/draft/setMethod':
            draft.current.method = action.payload
            draft.current.dirty = true
            break
        case 'ht/draft/setQueryParamInclude':
            draft.current.queryParameters[action.meta.paramIndex].include = action.payload
            updateUrlFromQueryParams(draft.current)
            draft.current.dirty = true
            break
        case 'ht/draft/setQueryParamName':
            draft.current.queryParameters[action.meta.paramIndex].name = action.payload
            updateUrlFromQueryParams(draft.current)
            draft.current.dirty = true
            break
        case 'ht/draft/setQueryParamValue':
            draft.current.queryParameters[action.meta.paramIndex].value = action.payload
            updateUrlFromQueryParams(draft.current)
            draft.current.dirty = true
            break
        case 'ht/draft/setUrl': {
            let url = action.payload
            draft.current.url = url

            let paramsStartIndex = url.indexOf("?")
            let includedParams: QueryParameter[]
            if (paramsStartIndex > -1) {
                // There are query params present
                includedParams =
                    url.substring(paramsStartIndex+1)
                        .split("&")
                        .filter(paramStr => paramStr.length > 0)
                        .map(paramStr => {
                            if(paramStr.includes("=")) {
                                let [name, value] = paramStr.split("=")
                                return QueryParameter.create({ name, value, include: true })
                            } else {
                                return QueryParameter.create({ name: paramStr, value: "", include: true })
                            }
                        })



            } else {
                includedParams = []
            }
            let notIncludedParams = draft.current.queryParameters.filter(param => !param.include)

            draft.current.queryParameters = [...includedParams, ...notIncludedParams]
            draft.current.dirty = true
            break
        }

        case 'ht/history/openRequest':
            draft.current = { ...action.payload, saved: false, dirty: false }
            break
        case 'ht/repository/openRequest':
            draft.current = { ...action.payload, saved: true, dirty: false }
            break
        case 'ht/repository/saveRequest':
            draft.current.dirty = false
            draft.current.saved = true
            break
    }
}, DraftState.Default)

const updateUrlFromQueryParams = (draft: Draft<Request>) => {
    let paramsStr = draft.queryParameters
        .filter(param => param.include)
        .map(param =>
            param.value.length > 0 ? `${param.name}=${param.value}` : param.name
        ).join("&")
    if(paramsStr.length > 0) paramsStr = '?' + paramsStr

    let paramsStartIndex = draft.url.indexOf("?")
    if(paramsStartIndex == -1) paramsStartIndex = draft.url.length

    draft.url = draft.url.substring(0, paramsStartIndex) + paramsStr
}