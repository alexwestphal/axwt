/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {IdMap} from '@axwt/core'

import {ElementKey, Element, ElementId} from '../../data'

export interface ElementsState {
    byId: IdMap<ElementId, Element>
    currentElement: ElementKey | null
}

export namespace ElementsState {
    export const Default: ElementsState = {
        byId: {},
        currentElement: null
    }
}