
import produce, {createDraft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import {ChangeStack}  from './ChangeStack'


const empty = {} as ChangeStack<string, string>

test("init", () => {

    let result = produce(empty, (draft) => { ChangeStack.init(draft, "A") })

    expect(result.current).toBe("A")
    expect(result.history).toEqual(["A"])
    expect(result.historyIndex).toBe(0)
    expect(result.prevChange).toBeUndefined()
})

test("init (existing board)", () => {
    let state = { current: "B", history: ["A", "B", "C"], historyIndex: 1 }
    let result = produce(state, (draft) => { ChangeStack.init(draft, "A2") })

    expect(result.current).toBe("A2")
    expect(result.history).toEqual(["A2"])
    expect(result.historyIndex).toBe(0)
})

test("push (init)", () => {
    let state = { current: "A", history: ["A"], historyIndex: 0 }
    let result = produce(state, (draft) => { ChangeStack.push(draft, "B") })

    expect(result.current).toBe("B")
    expect(result.history).toEqual(["A", "B"])
    expect(result.historyIndex).toBe(1)
})

test("push (not at end)", () => {
    let state = { current: "B", history: ["A", "B", "C", "D"], historyIndex : 1 }
    let result = produce(state, (draft) => { ChangeStack.push(draft, "C2") })

    expect(result.current).toBe("C2")
    expect(result.history).toEqual(["A", "B", "C2"])
    expect(result.historyIndex).toBe(2)
})

test("push (full)", () => {
    let state = { current: "A50", history: ArrayUtils.range(0, 50).map(i => `A${i+1}`), historyIndex: 49 }
    let result = produce(state, (draft) => { ChangeStack.push(draft, "A51") })

    expect(result.current).toBe("A51")
    expect(result.history.length).toBe(50)
    expect(result.history[0]).toBe("A2")
    expect(result.history[49]).toBe("A51")
    expect(result.historyIndex).toBe(49)
})

test("replace", () => {
    let state = { current: "B", history: ["A", "B"], historyIndex: 1 }
    let result = produce(state, (draft) => { ChangeStack.replace(draft, "B2") })

    expect(result.current).toBe("B2")
    expect(result.history).toEqual(["A", "B2"])
    expect(result.historyIndex).toBe(1)
})

test("replace (not at end)", () => {
    let state = { current: "C", history: ["A", "B", "C", "D"], historyIndex : 2 }
    let result = produce(state, (draft) => { ChangeStack.replace(draft, "C2") })

    expect(result.current).toBe("C2")
    expect(result.history).toEqual(["A", "B", "C2"])
    expect(result.historyIndex).toBe(2)
})

test("moveForward", () => {
    let state = { current: "B", history: ["A", "B", "C"], historyIndex: 1 }
    let result = produce(state, (draft) => { ChangeStack.moveForward(draft) })

    expect(result.current).toBe("C")
    expect(result.historyIndex).toBe(2)
})

test("moveForward (at end)", () => {
    let state = { current: "C", history: ["A", "B", "C"], historyIndex: 2 }
    let draft = createDraft(state)

    expect(() => ChangeStack.moveForward(draft)).toThrow(/IllegalOperation/)
})

test("moveBackward", () => {
    let state = { current: "B", history: ["A", "B", "C"], historyIndex: 1 }
    let result = produce(state, (draft) => { ChangeStack.moveBackward(draft) })

    expect(result.current).toBe("A")
    expect(result.historyIndex).toBe(0)
})

test("moveBackward (at start)", () => {
    let state = { current: "A", history: ["A", "B", "C"], historyIndex: 0 }
    let draft = createDraft(state)

    expect(() => ChangeStack.moveBackward(draft)).toThrow(/IllegalOperation/)
})

test("canMove (start)", () => {
    let state = { current: "A", history: ["A", "B", "C"], historyIndex: 0 }

    expect(ChangeStack.canMove(state)).toMatchObject({ forward: true, backward: false })
})

test("canMove (middle)", () => {
    let state = { current: "B", history: ["A", "B", "C"], historyIndex: 1 }

    expect(ChangeStack.canMove(state)).toMatchObject({ forward: true, backward: true })
})

test("canMove (end)", () => {
    let state = { current: "C", history: ["A", "B", "C"], historyIndex: 2 }

    expect(ChangeStack.canMove(state)).toMatchObject({ forward: false, backward: true })
})