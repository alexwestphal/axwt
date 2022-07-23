
import * as Core from './store/Core'
import {CommunicationActions, ErrorActions} from './store'
import {ServerConnection} from './ServerConnection'


type QueryParams = { [key: string]: any}

export abstract class AbstractServerAPI {

    public static AppRoot = "/axwt/api"

    protected accessToken: string
    protected dispatch: Core.ThunkDispatch


    setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }

    setDispatch(dispatch: Core.ThunkDispatch) {
        this.dispatch = dispatch
    }

    protected fetch<R>(callingFunction: Function, resource: string, subResource?: string, params?: QueryParams): Promise<R> {
        let url = AbstractServerAPI.buildUrl(resource, subResource, params)

        return this.doRequest(callingFunction, url, {
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Bearer ${this.accessToken}`
            }
        })
    }

    protected execute<T, R>(callingFunction: Function, resource: string, functionName: string, params?: QueryParams, entity?: T, beacon: boolean = false, cancelDuplicates: boolean = false): Promise<R> {
        let url = AbstractServerAPI.buildUrl(resource, functionName, params)

        let request: RequestInit = entity === undefined
            ? {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${this.accessToken}`
                },
                keepalive: beacon
            }
            : {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${this.accessToken}`
                },
                keepalive: beacon,
                body: JSON.stringify(entity)
            }

        return this.doRequest(callingFunction, url, request, cancelDuplicates)
    }

    protected uploadFile<R>(callingFunction: Function, resource: string, functionName: string, params: QueryParams, file: File): Promise<R> {
        let url = AbstractServerAPI.buildUrl(resource, functionName, params)

        let formData = new FormData()
        formData.append("file", file)
        formData.append("type", file.type)

        return this.doRequest(callingFunction, url, {
            method: 'post',
            headers: {
                'Authorization' : `Bearer ${this.accessToken}`
            },
            body: formData
        })
    }

    private doRequest<R>(callingFunction: Function, url: string, request: RequestInit, cancelDuplicates?: boolean): Promise<R> {
        let requestKey = callingFunction.name

        return ServerConnection.makeRequest(requestKey, url, request, {
            cancelDuplicates,
            listener: (ev) => {
                switch (ev.type) {
                    case 'START':
                        this.dispatch(CommunicationActions.requestStart(requestKey))
                        break
                    case 'FINISH':
                        this.dispatch(CommunicationActions.requestEnd(requestKey))
                        break
                }
            }
        })
            .then(response => this.processResponse<R>(url, response))
            .catch(error => {
                this.dispatch(CommunicationActions.requestError(requestKey));

                console.error(`[OPCE] ${error.message}`)
                this.dispatch(ErrorActions.appendError(error))

                return Promise.reject(error)
            })
    }

    private processingErrorHandler = error => Promise.reject({ errorType: 'ResponseProcessingError', message: error.message })

    private processResponse<R>(url: string, response: Response): Promise<R> {
        let result: Promise<R>

        // No response because request was cancelled
        if(response == null) return Promise.resolve(null)

        if(response.ok) {
            // Status in 200 range
            result = response.json().catch(this.processingErrorHandler).then(json => {
                if(json.requestStatus == 'Ok') return json
                else if(json.requestStatus == 'Error') return Promise.reject({...json, url})
                else throw new Error("Response from server contains no 'requestStatus', url="+url)
            })
        } else {
            // Error Status
            result = response.text().catch(this.processingErrorHandler).then(text => {
                let error
                if(text.startsWith("{")) {
                    // Response is JSON (probably a properly formatted error)
                    error = { ...JSON.parse(text), url }
                } else if(text.substring(0, 15).toLowerCase().startsWith("<!doctype html>")) {
                    // Response is HTML
                    let htmlTitle = text.match(/<title>(.*)<\/title>/)[1]
                    let htmlBody = text.substring(text.indexOf("<body>")+6, text.indexOf("</body>"))

                    error = {
                        errorType: "ServerError", errorKind: 'Fatal', url,
                        message: htmlTitle, html: { __html: htmlBody }
                    }
                } else {
                    // Response is something else we can't interpret
                    let message = text.length > 20 ? `${text.substring(0, 20)}...` : text

                    error = { errorType: "ServerError", errorKind: 'Fatal', message, url, extra: text }
                }

                return Promise.reject(error)
            })
        }
        return result
    }


    private static buildUrl(resource: string, subResourceOrFunctionName?: string, params?: QueryParams): string {
        let path: string = subResourceOrFunctionName
            ? `${AbstractServerAPI.AppRoot}/${resource}/${subResourceOrFunctionName}`
            : `${AbstractServerAPI.AppRoot}/${resource}`

        params = params ? { ...params } : {}
        for(let key in params) {
            if(params[key] === null || params[key] === undefined) {
                delete params[key]
            }
        }

        let paramsString = new URLSearchParams(params).toString()
        if(paramsString.length > 0) return `${path}?${paramsString}`
        else return path
    }
}

export default AbstractServerAPI
