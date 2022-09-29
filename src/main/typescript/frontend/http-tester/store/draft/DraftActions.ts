

import {Action, createAction, UUID} from '@axwt/core'

import {Method, Request} from '../../data'

export namespace DraftActions {

    export type DeleteHeader = Action<'ht/draft/deleteHeader', null, { headerIndex: number }>
    export type DeleteQueryParam = Action<'ht/draft/deleteQueryParam', null, { paramIndex: number }>

    export type LoadDraft = Action<'ht/draft/loadDraft', Request>

    export type NewHeader = Action<'ht/draft/newHeader'>
    export type NewQueryParam = Action<'ht/draft/newQueryParam'>

    export type NewDraft = Action<'ht/draft/newDraft', Request>

    export type SaveDraft = Action<'ht/draft/saveDraft', Request>

    export type SetHeaderInclude = Action<'ht/draft/setHeaderInclude', boolean, { headerIndex: number }>
    export type SetHeaderName = Action<'ht/draft/setHeaderName', string, { headerIndex: number }>
    export type SetHeaderValue = Action<'ht/draft/setHeaderValue', string, { headerIndex: number }>

    export type SetMethod = Action<'ht/draft/setMethod', Method>

    export type SetQueryParamInclude = Action<'ht/draft/setQueryParamInclude', boolean, { paramIndex: number }>
    export type SetQueryParamName = Action<'ht/draft/setQueryParamName', string, { paramIndex: number }>
    export type SetQueryParamValue = Action<'ht/draft/setQueryParamValue', string, { paramIndex: number }>

    export type SetUrl = Action<'ht/draft/setUrl', string>

    export type Any = DeleteHeader | DeleteQueryParam | LoadDraft | NewHeader |  NewQueryParam | NewDraft | SaveDraft
        | SetHeaderInclude | SetHeaderName | SetHeaderValue | SetMethod | SetQueryParamInclude | SetQueryParamName
        | SetQueryParamValue | SetUrl


    export const deleteHeader = (headerIndex: number): DeleteHeader =>
        createAction('ht/draft/deleteHeader', null, { headerIndex })

    export const deleteQueryParam = (paramIndex: number): DeleteQueryParam =>
        createAction('ht/draft/deleteQueryParam', null, { paramIndex })

    export const newHeader = (): NewHeader =>
        createAction('ht/draft/newHeader')

    export const newQueryParam = (): NewQueryParam =>
        createAction('ht/draft/newQueryParam')

    export const newDraft = (): NewDraft => {
        let newRequestId = UUID.create()
        return createAction('ht/draft/newDraft', Request.create({}), {newRequestId})
    }

    export const setHeaderInclude = (headerIndex: number, include: boolean): SetHeaderInclude =>
        createAction('ht/draft/setHeaderInclude', include, { headerIndex })

    export const setHeaderName = (headerIndex: number, name: string): SetHeaderName =>
        createAction('ht/draft/setHeaderName', name, { headerIndex })

    export const setHeaderValue = (headerIndex: number, value: string): SetHeaderValue =>
        createAction('ht/draft/setHeaderValue', value, { headerIndex })

    export const setMethod = (method: Method): SetMethod =>
        createAction('ht/draft/setMethod', method)

    export const setQueryParamInclude = (paramIndex: number, include: boolean): SetQueryParamInclude =>
        createAction('ht/draft/setQueryParamInclude', include, { paramIndex })

    export const setQueryParamName = (paramIndex: number, name: string): SetQueryParamName =>
        createAction('ht/draft/setQueryParamName', name, { paramIndex })

    export const setQueryParamValue = (paramIndex: number, value: string): SetQueryParamValue =>
        createAction('ht/draft/setQueryParamValue', value, { paramIndex })

    export const setUrl = (url: string): SetUrl =>
        createAction('ht/draft/setUrl', url)
}