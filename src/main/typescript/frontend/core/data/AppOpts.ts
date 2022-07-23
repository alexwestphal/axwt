
export interface AppOpts {

    X_CVInstructions: boolean
    X_CVResizeablePanels: boolean
    X_CVWindowTiling: boolean
}

export namespace AppOpts {
    export const createProxy = (options: AppOpts, setFlag: (option: keyof AppOpts, value: boolean) => void) =>
        new Proxy(options, {
            set(target: AppOpts, option: string, value: boolean): boolean {
                if(target.hasOwnProperty(option)) {
                    setFlag(option as keyof AppOpts, !!value)
                    return false
                } else {
                    console.error(`Unrecognised appOption: '${option}'`)
                    return true
                }
            }
        })
}

