/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {createSelector, Selector} from 'reselect'

import {IdMap} from '@axwt/core'

import {Element, ElementId} from '../../data'

import * as PV from '../PV'


export const selectElement: Selector<PV.RootState, Element, [ElementId]> =
    (state, elementId) => elementId ? state.pv.elements.byId[elementId] : null

export const selectElements: Selector<PV.RootState, Element[]> =
    (state) => Object.values(state.pv.elements.byId)

export const selectElementsMap: Selector<PV.RootState, IdMap<ElementId, Element>> =
    (state) => state.pv.elements.byId


export const selectCurrentElement: Selector<PV.RootState, Element> =
    (state) => {
        let current = state.pv.elements.currentElement
        return current ? state.pv.elements.byId[current.elementId] : null
    }