
import {HiddenSingleTechnique} from './HiddenSingleTechnique'
import {NakedSingleTechnique} from './NakedSingleTechnique'
import {NoOpTechnique, SearchTechnique, TechniqueKey} from './SearchTechnique'

export {HiddenSingleTechnique} from './HiddenSingleTechnique'
export {NakedSingleTechnique} from './NakedSingleTechnique'
export * from './SearchTechnique'

export const TechniqueOrder: TechniqueKey[] = ['NakedSingle', 'HiddenSingle']

export const selectTechnique = (key: TechniqueKey): SearchTechnique => {
    switch(key) {
        case 'HiddenSingle':
            return new HiddenSingleTechnique()
        case 'NakedSingle':
            return new NakedSingleTechnique()
        default:
            return new NoOpTechnique()
    }
}