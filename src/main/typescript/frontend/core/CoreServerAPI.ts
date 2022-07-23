
import {AppOpts} from './data'
import {Language} from './i18n'

import AbstractServerAPI from './AbstractServerAPI'

class CoreServerAPI extends AbstractServerAPI {


    getInitData(): Promise<CoreServerAPI.GetInitResponse> {
        return this.fetch(this.getInitData, "initApplication", null)
    }

    getPhrases(module: string, language?: string): Promise<CoreServerAPI.GetPhrasesResponse> {
        return this.fetch(this.getPhrases, "phrases", null, { module, language })
    }
}

namespace CoreServerAPI {

    export interface GetInitResponse {
        readonly accessToken: string
        readonly appFlags: AppOpts
    }

    export interface GetPhrasesResponse {
        language: Language
    }
}

export default CoreServerAPI