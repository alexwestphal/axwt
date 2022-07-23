
import {v4 as uuidv4} from 'uuid'

export type UUID = string
export namespace UUID {
    export const create = <T extends UUID = UUID>() => uuidv4() as T

    export const createArray = <T extends UUID = UUID>(n: number = 10): ReadonlyArray<T> => {
        let result = []
        for(let i = 0; i < n; i++) result.push(uuidv4())
        return result as ReadonlyArray<T>
    }
}
export default UUID


export type IdMap<K extends UUID, V> = { readonly [key: string]: V }
export namespace IdMap {

    export const fromArray = <K extends UUID, V extends { id: K }>(array: ReadonlyArray<V>) => {
        let result = {}
        for(let value of array) {
            result[value.id as string] = value
        }
        return result
    }

}