import {Sudoku} from '../data'

export type TechniqueKey = 'Jellyfish' | 'HiddenQuad' | 'HiddenPair' | 'HiddenSingle' | 'HiddenTriple' | 'NakedPair' | 'NakedQuad' | 'NakedSingle' | 'NakedTriple' | 'PointingPair' | 'PointingTriple' | 'Swordfish' | 'XWing' | 'YWing'

export interface SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null
}


export interface SearchResult {
    readonly key: TechniqueKey
    readonly targetHouse?: Sudoku.House
    readonly candidateHighlights: ReadonlyArray<CandidateHighlight>
    readonly foundValues: ReadonlyArray<FoundValue>
    readonly candidateClearances: ReadonlyArray<CandidateClearances>
}

export interface FoundValue {
    readonly x: number
    readonly y: number
    readonly value: number
}

export interface CandidateHighlight {
    readonly x: number
    readonly y: number
    readonly candidates: ReadonlyArray<number>
}

export interface CandidateClearances {
    readonly x: number
    readonly y: number
    readonly toClear: ReadonlyArray<number>
}


export class NoOpTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {
        return null
    }
}