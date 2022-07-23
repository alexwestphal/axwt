/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button} from '@mui/material'

import {createClasses} from '@axwt/util'

import {Element} from '../data'
import { PathSegmentsActions, selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'

import EditPathSegment from './EditPathSegment'


const pathSegmentsPanelClasses = createClasses("PathSegmentsPanel", ["segmentList"])

export const PathSegmentsPanel: React.FC = () => {

    const path = useTypedSelector(selectCurrentElement) as Element.Path

    const dispatch = useThunkDispatch()

    const handleNewCommand = () => {
        dispatch(PathSegmentsActions.newSegment(path.elementId))
    }

    const classes = pathSegmentsPanelClasses

    return <Box
        className={classes.root}
        sx={{

            [`& .${classes.segmentList}`]: {
                flex: '1 0 0',
                marginBottom: 1
            }
        }}
    >
        <div className={classes.segmentList}>
            {path.segmentIds.map((segmentId, index) =>
                <EditPathSegment key={segmentId} pathId={path.elementId} segmentId={segmentId} first={index==0}/>
            )}
        </div>
        <Button onClick={handleNewCommand}>Add Segment</Button>
    </Box>
}

export default PathSegmentsPanel