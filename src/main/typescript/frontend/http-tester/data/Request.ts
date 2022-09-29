
import {UUID} from '@axwt/core'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD'

export type RequestId = UUID

export interface Request {
    requestId: RequestId

    name: string
    method: Method
    url: string

    queryParameters: QueryParameter[]
    headers: RequestHeader[]

    response?: Response
}
export namespace Request {
    export const Empty: Omit<Request, 'requestId'> = {
        name: "",
        method: 'GET',
        url: "",
        queryParameters: [],
        headers: [],
    }

    export const create = (partial: Partial<Request>): Request => ({...Empty, ...partial, requestId: UUID.create() })
}

export interface QueryParameter {
    name: string
    value: string
    include: boolean
}
export namespace QueryParameter {
    export const Default: QueryParameter = {
        name: "",
        value: "",
        include: true
    }
    export const create = (partial: Partial<QueryParameter>): QueryParameter => ({ ...Default, ...partial })
}


export interface RequestHeader {
    name: string
    value: string
    include: boolean
}
export namespace RequestHeader {
    export const Default: RequestHeader = {
        name: "",
        value: "",
        include: true
    }
    export const create = (partial: Partial<RequestHeader>): RequestHeader => ({ ...Default, ...partial })
}