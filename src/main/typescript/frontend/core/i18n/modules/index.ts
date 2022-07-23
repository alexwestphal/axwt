
/*
* Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
*/

import {Phrase} from '../language'

import AssessmentEditorPhrases from './AssessmentEditorPhrases'
import AssessmentRunnerPhrases from './AssessmentRunnerPhrases'
import ContentViewerPhrases from './ContentViewerPhrases'
import CommonPhrases from './CommonPhrases'
import NoteTakerPhrases from './NoteTakerPhrases'


export interface ModulePhrases {
    [key: string]: Phrase
}

export interface Phrases extends CommonPhrases, AssessmentEditorPhrases, AssessmentRunnerPhrases, ContentViewerPhrases, NoteTakerPhrases {}