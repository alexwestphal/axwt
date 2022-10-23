
export namespace SetUtils {

    export const difference = <T>(xs: ReadonlyArray<T>, ys: ReadonlyArray<T>): ReadonlyArray<T> => {
        return xs.filter(x => !ys.includes(x))
    }

    export const disjointUnion = <T>(xs: ReadonlyArray<T>, ...yss: ReadonlyArray<T>[]): ReadonlyArray<T> => {
        if(yss.length == 0) return xs

        let [ys, ...rest] = yss
        if(xs === null || ys === null) return null

        let result = []
        for(let x of xs) {
            if(!ys.includes(x)) {
                // x is in xs but not ys
                result.push(x)
            }
        }
        for(let y of ys) {
            if(!xs.includes(y)) {
                // y is in ys but not sx
                result.push(y)
            }
        }
        return disjointUnion(result, ...rest)
    }

    export const intersect = <T>(xs: ReadonlyArray<T>, ...yss: ReadonlyArray<T>[]): ReadonlyArray<T> => {
        if(yss.length == 0) return xs

        let [ys, ...rest] = yss
        if(xs === null || ys === null) return null

        let result = []
        for(let x of xs) {
            if (ys.includes(x)) result.push(x)
        }

        return intersect(result, ...rest)
    }

    export const isEqual = <T>(xs: ReadonlyArray<T>, ys: ReadonlyArray<T>): boolean => {
        if(xs === null || ys === null || xs.length != ys.length) return false

        for(let x of xs) {
            if(!ys.includes(x)) {
                // x is not in ys
                return false
            }
        }
    }

    /**
     * Check if xs is a subset (or equal) to ys
     */
    export const isSubset = <T>(xs: ReadonlyArray<T>, ys: ReadonlyArray<T>): boolean => {
        if(xs === null || ys === null || xs.length > ys.length) return false

        for(let x of xs) {
            if(!ys.includes(x)) {
                // x is not in ys
                return false
            }
        }
        return true
    }

    export const setOf = <T>(...xs: T[]): ReadonlyArray<T> => {
        let result = []
        for(let x of xs) {
            if(!result.includes(x)) {
                result.push(x)
            }
        }
        return result
    }

    export const union = <T>(xs: ReadonlyArray<T>, ...yss: ReadonlyArray<T>[]): ReadonlyArray<T> => {
        if(yss.length == 0) return xs

        let [ys, ...rest] = yss
        if(xs === null || ys === null) return null

        let result = [...xs]
        for(let y of ys) {
            if(!result.includes(y)) result.push(y)
        }

        return union(result, ...rest)
    }
}