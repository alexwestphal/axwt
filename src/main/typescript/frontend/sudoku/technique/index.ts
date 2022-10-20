
import {HiddenPairTechnique} from './HiddenPairTechnique'
import {HiddenSingleTechnique} from './HiddenSingleTechnique'
import {NakedPairTechnique} from './NakedPairTechnique'
import {NakedSingleTechnique} from './NakedSingleTechnique'
import {PointingPairTechnique} from './PointingPairTechnique'
import {NoOpTechnique, SearchTechnique, TechniqueKey} from './SearchTechnique'

export * from './SearchTechnique'

export const TechniqueOrder: TechniqueKey[] = ['NakedSingle', 'HiddenSingle', 'NakedPair', "HiddenPair", "PointingPair"]

export const selectTechnique = (key: TechniqueKey): SearchTechnique => {
    switch(key) {
        case 'HiddenPair':
            return new HiddenPairTechnique()
        case 'HiddenSingle':
            return new HiddenSingleTechnique()
        case 'NakedPair':
            return new NakedPairTechnique()
        case 'NakedSingle':
            return new NakedSingleTechnique()
        case 'PointingPair':
            return new PointingPairTechnique()
        default:
            return new NoOpTechnique()
    }
}