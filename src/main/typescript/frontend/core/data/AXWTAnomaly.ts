
import {HtmlString} from './HtmlString'

export interface AXWTAnomaly {
    readonly anomalyType: string
    readonly anomalyKind: AXWTAnomaly.AnomalyKind
    readonly message: string
    readonly reason?: string

    readonly html: HtmlString
}

export namespace AXWTAnomaly {

    export type AnomalyKind = 'User' | 'Fatal' | 'Incidental'

    export type Handler = (error: AXWTAnomaly) => void
}

export default AXWTAnomaly