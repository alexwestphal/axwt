
import {HiddenPairTechnique} from './HiddenPairTechnique'
import {HiddenQuadTechnique} from './HiddenQuadTechnique'
import {HiddenSingleTechnique} from './HiddenSingleTechnique'
import {HiddenTripleTechnique} from './HiddenTripleTechnique'
import {NakedPairTechnique} from './NakedPairTechnique'
import {NakedQuadTechnique} from './NakedQuadTechnique'
import {NakedSingleTechnique} from './NakedSingleTechnique'
import {NakedTripleTechnique} from './NakedTripleTechnique'
import {PointingPairTechnique} from './PointingPairTechnique'
import {PointingTripleTechnique} from './PointingTripleTechnique'
import {NoOpTechnique, SearchTechnique, TechniqueKey} from './SearchTechnique'
import {XWingTechnique} from './XWingTechnique'
import {YWingTechnique} from './YWingTechnique'

export * from './SearchTechnique'

export const TechniqueOrder: TechniqueKey[] = ['NakedSingle', 'HiddenSingle', 'NakedPair', "HiddenPair", "PointingPair", "NakedTriple", "NakedQuad", "PointingTriple", "HiddenTriple", "HiddenQuad", "XWing", "YWing"]

export const selectTechnique = (key: TechniqueKey): SearchTechnique => {
    switch(key) {
        case 'HiddenPair':      return new HiddenPairTechnique()
        case 'HiddenQuad':      return new HiddenQuadTechnique()
        case 'HiddenSingle':    return new HiddenSingleTechnique()
        case 'HiddenTriple':    return new HiddenTripleTechnique()
        case 'NakedPair':       return new NakedPairTechnique()
        case 'NakedQuad':       return new NakedQuadTechnique()
        case 'NakedSingle':     return new NakedSingleTechnique()
        case 'NakedTriple':     return new NakedTripleTechnique()
        case 'PointingPair':    return new PointingPairTechnique()
        case 'PointingTriple':  return new PointingTripleTechnique()
        case 'XWing':           return new XWingTechnique()
        case 'YWing':           return new YWingTechnique()
        default:                return new NoOpTechnique()
    }
}