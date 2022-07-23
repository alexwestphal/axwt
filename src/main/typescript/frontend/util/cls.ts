/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

const PREFIX = "axwt"

type ClsArg = string | ClsArg[] | { [key: string]: boolean }

const processRawNames = (...args: ClsArg[]): string[] => {
    let result = []

    for(let arg of args) {
        if(!arg) continue
        if(typeof arg === 'string') {
            result.push(arg)
        } else if(Array.isArray(arg)) {
            // Apply clsNames to the array (recursive)
            result.push(...processRawNames(...arg))
        } else if(typeof arg === 'object') {
            for(let key in arg) {
                if(arg[key]) result.push(key)
            }
        }
    }
    return result
}

export const cls = (...args: ClsArg[]): string =>
    processRawNames(args).map(key => key.startsWith(PREFIX) ? key : `${PREFIX}-${key}`).join(" ")

export default cls


type KeyMap<K extends string> = { [Property in K]: string }

export const createIDs = <K extends string>(component: string, keys: K[]): KeyMap<K> => {
    let result = {} as KeyMap<K>
    for(let key of keys) result[key] = `${PREFIX}-${component}-${key}`

    return result
}

export const createClasses = <K extends string>(component: string, keys: K[]): KeyMap<'root' | K> => {
    let result = {} as KeyMap<'root' | K>
    result.root = `${PREFIX}-${component}-root`
    for(let key of keys) result[key] = `${PREFIX}-${component}-${key}`

    return result
}