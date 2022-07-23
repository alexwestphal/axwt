/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Button, Divider, List, ListItem, ListItemText} from '@mui/material'

import {createClasses} from '@axwt/util'

import {ElementsActions, selectElements, useThunkDispatch, useTypedSelector} from '../store'


const elementsPanelClasses = createClasses("ElementsPanel", [])

export const ElementListPanel: React.FC = () => {

    const elements = useTypedSelector(selectElements)

    const dispatch = useThunkDispatch()

    const handleNewPathClick = () => {

    }

    const classes = elementsPanelClasses

    return <Box className={classes.root}>
        <List>
            {elements.map(element => <ListItem key={element.elementId}>
                <ListItemText primary={element.elementType}/>
            </ListItem>)}
        </List>
    </Box>
}

export default ElementListPanel