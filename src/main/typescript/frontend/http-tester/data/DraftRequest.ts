

import {Request} from './Request'

export interface DraftRequest extends Request {

    saved: boolean
    dirty: boolean
}