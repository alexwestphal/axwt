
export * from './board'
export * from './solve'
export * from './Sudoku'

export type AppMode = 'Define' | 'Play' | 'Solve'

export const AppModes: ReadonlyArray<AppMode> = ['Define', 'Play', 'Solve']