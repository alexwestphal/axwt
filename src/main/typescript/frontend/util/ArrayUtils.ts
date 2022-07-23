/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

export namespace ArrayUtils {

    /**
     * Create an array holding the values of `array` that are not in the `other` array
     */
    export const difference = <T>(array: Array<T>, ...otherArrays: Array<T>[]): Array<T> => {
        if(array == null || array.length == 0) return []

        let excludeValues = flatten(otherArrays)

        let result: Array<T> = []
        for(let xi=0; xi < array.length; xi++) {
            let x = array[xi]

            let yi = 0
            for(; yi<excludeValues.length; yi++) {
                let y = excludeValues[yi]
                if(x === y) break
            }
            if(yi == excludeValues.length) {
                // x didn't match any value in excludeValues
                result.push(x)
            }
        }
        return result
    }

    export const distinct = <T>(array: Array<T>): Array<T> => {
        if(array == null || array.length == 0) return []

        let result: Array<T> = []
        for(let xi=0; xi < array.length; xi++) {
            let x = array[xi]

            let yi = 0
            for(; yi<result.length; yi++) {
                if(x === result[yi]) break
            }
            if(yi == result.length) {
                // x didn't match any value in result
                result.push(x)
            }
        }
        return result
    }

    export const distinctBy = <T, U>(array: Array<T>, f: (a: T) => U): Array<T> => {
        if(array == null || array.length == 0) return []

        let seen: Array<U> = [] // Array of previously seen mapped values
        let result: Array<T> = []

        for(let xi=0; xi < array.length; xi++) {
            let x: T = array[xi]
            let xm: U = f(x)

            let yi = 0
            for(; yi<seen.length; yi++) {
                if(xm === seen[yi]) break
            }
            if(yi == seen.length) {
                // f(x) didn't match any value in seen
                seen.push(xm)
                result.push(x)
            }
        }
        return result
    }

    export const filterAndMap = <T, R>(
        array: Array<T>,
        predicate: (item: T, index: number, array: Array<T>) => boolean,
        transform: (item: T, index: number, array: Array<T>) => R) => {

        let result: R[] = []
        for(let i=0; i<array.length; i++) {
            let item = array[i]
            if(predicate(item, i, array)) {
                result.push(transform(item, i, array))
            }
        }

        return result
    }

    /**
     * Flatten multiple arrays into a single array
     */
    export const flatten = <T>(arrays: Array<Array<T>>): Array<T> => [].concat(...arrays)

    /**
     * Find the two-dimensional index of a value
     */
    export const index2dOf = <T>(array: ReadonlyArray<ReadonlyArray<T>>, value: T): [number, number] => {
        for(let y=0; y<array.length; y++) {
            for(let x=0; x<array[y].length; x++) {
                if(array[y][x] === value) return [x, y]
            }
        }
        return null
    }

    /**
     * Insert the specified value into the array after another.
     *
     */
    export const insertAfter = <T>(array: Array<T>, value: T, after: T) => {
        let index = array.indexOf(after)
        if(index > -1) array.splice(index+1, 0, value)
        else array.push(value)
    }

    /**
     * Create an array holding a range of values
     * @param start Beginning of the range (inclusive)
     * @param end End of the range (exclusive)
     * @param step Step between each value in the range. Default is `1`
     */
    export const range = (start: number, end: number, step?: number) => {

        // Define a step if not already
        if(step === undefined) step = start < end ? 1 : -1

        // Length depends on the size of the step
        let length = Math.max(Math.ceil((end - start) / step), 0)

        let result = new Array<number>(length)
        let current = start
        for(let i=0; i<length; i++) {
            result[i] = current
            current += step
        }
        return result
    }

    /**
     * Remove the first occurrence of the specified value from the array.
     */
    export const remove = <T>(array: Array<T>, value: T) => {
        let index = array.indexOf(value)
        if(index > -1)
            array.splice(index, 1)
    }

    /**
     * Remove the first item in the array that satisfied the predicate.
     */
    export const removeWhere = <T>(array: Array<T>, predicate: (item: T, index: number, array: Array<T>) => boolean) => {
        let index = array.findIndex(predicate)
        if(index > -1)
            array.splice(index, 1)
    }

}

export default ArrayUtils