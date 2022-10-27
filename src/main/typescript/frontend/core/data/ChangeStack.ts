import {castDraft, Draft} from 'immer'

export interface ChangeStack<T, C> {

    current: T
    history: T[]
    historyIndex: number
    prevChange?: C
}

export namespace ChangeStack {

    const StackLimit = 50

    export const init = <T,C> (draft: Draft<ChangeStack<T,C>>, initValue: T) => {
        draft.current = castDraft(initValue)
        draft.history = castDraft([initValue])
        draft.historyIndex = 0
        draft.prevChange = undefined
    }

    export const push = <T,C> (draft: Draft<ChangeStack<T,C>>, nextValue: T, change?: C) => {
        draft.current = castDraft(nextValue)
        let history = draft.history, index = draft.historyIndex
        if(index < history.length - 1) {
            // Remove any forward history
            history = history.slice(0, index + 1)
        } else if(history.length == StackLimit) {
            // At the stack limit, trim the front
            history = history.slice(1)
            index--
        }

        draft.history = [...history, castDraft(nextValue)]
        draft.historyIndex = index + 1

        if(change != undefined) draft.prevChange = castDraft(change)
    }

    export const replace = <T,C> (draft: Draft<ChangeStack<T,C>>, nextValue: T, change?: C) => {
        draft.current = castDraft(nextValue)
        if(draft.historyIndex < draft.history.length - 1) {
            // Remove any forward history
            draft.history = draft.history.slice(0, draft.historyIndex + 1)
        }
        draft.history[draft.historyIndex] = castDraft(nextValue)

        if(change != undefined) draft.prevChange = castDraft(change)
    }

    export const moveForward = <T,C> (draft: Draft<ChangeStack<T,C>>) => {
        if(draft.historyIndex >= draft.history.length -1) throw new Error("IllegalOperation. Already at end of history")

        draft.historyIndex = draft.historyIndex + 1
        draft.current = draft.history[draft.historyIndex]
        draft.prevChange = undefined
    }

    export const moveBackward = <T,C> (draft: Draft<ChangeStack<T,C>>) => {
        if(draft.historyIndex <= 0) throw new Error("IllegalOperation. Already at beginning of history")

        draft.historyIndex = draft.historyIndex - 1
        draft.current = draft.history[draft.historyIndex]
        draft.prevChange = undefined
    }

    export type CanMove = { forward: boolean, backward: boolean }

    export const canMove = <T,C> (changeStack: ChangeStack<T,C>): CanMove => {
        return {
            forward: changeStack.historyIndex < changeStack.history.length -1,
            backward: changeStack.historyIndex > 0
        }
    }
}