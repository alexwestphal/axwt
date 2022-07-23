/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

export class AssertionError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export const assert = (exp: boolean, message: string) => {
    if(!exp) throw new AssertionError(message)
}

export const assertNotNull = <T>(value: T, message: string): T => {
    if(value === undefined || value === null) {
        throw new AssertionError(message)
    }
    return value
}