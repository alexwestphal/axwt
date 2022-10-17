
import {HiddenSingleTechnique} from './HiddenSingleTechnique'
import {NakedPairTechnique} from './NakedPairTechnique'
import {NakedSingleTechnique} from './NakedSingleTechnique'
import {NoOpTechnique, SearchTechnique, TechniqueKey} from './SearchTechnique'


export {HiddenSingleTechnique} from './HiddenSingleTechnique'
export {NakedPairTechnique} from './NakedPairTechnique'
export {NakedSingleTechnique} from './NakedSingleTechnique'
export * from './SearchTechnique'

export const TechniqueOrder: TechniqueKey[] = ['NakedSingle', 'HiddenSingle', 'NakedPair']

export const selectTechnique = (key: TechniqueKey): SearchTechnique => {
    switch(key) {
        case 'HiddenSingle':
            return new HiddenSingleTechnique()
        case 'NakedPair':
            return new NakedPairTechnique()
        case 'NakedSingle':
            return new NakedSingleTechnique()
        default:
            return new NoOpTechnique()
    }
}