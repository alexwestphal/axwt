/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, List, ListItem, ListItemText} from '@mui/material'
import {blueGrey} from '@mui/material/colors'

import {cls, createClasses} from '@axwt/util'

import {Element} from '../data'
import {selectCurrentElement, selectElements, useThunkDispatch, useTypedSelector} from '../store'



const elementsPanelClasses = createClasses("ElementsPanel", ["listItem", "listItemCurrent", "listItemType", "subtleText"])

export const ElementListPanel: React.FC = () => {

    const elements = useTypedSelector(selectElements)
    const currentElement = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const handleNewPathClick = () => {

    }

    const classes = elementsPanelClasses

    return <Box
        className={classes.root}
        sx={{

            [`& .${classes.listItemCurrent}`]: {
                backgroundColor: blueGrey[50],
            },

            [`& .${classes.listItemType}`]: {
                fontWeight: 'bold'
            },

            [`& span.${classes.subtleText}`]: {
                color: blueGrey[300],
            }
        }}
    >
        <List disablePadding>
            {elements.map(element =>
                <ElementListItem
                    key={element.elementId}
                    element={element}
                    isCurrent={element.elementId == currentElement?.elementId}
                />
            )}
        </List>
    </Box>
}

export default ElementListPanel


export interface ElementListItemProps {
    element: Element
    isCurrent?: boolean
}


export const ElementListItem: React.FC<ElementListItemProps> = ({element, isCurrent}) => {

    const classes = elementsPanelClasses

    return <ListItem className={cls(classes.listItem, { [classes.listItemCurrent]: isCurrent })}>
        <ListItemText>
            <span className={classes.subtleText}>{"<"}</span>
            <span className={classes.listItemType}>{element.elementType}</span>
            {element.htmlId && <>
                <span className={classes.subtleText}>{" id=\""}</span>
                    {element.htmlId}
                <span className={classes.subtleText}>{"\""}</span>
            </>}
            <span className={classes.subtleText}>{">"}</span>
        </ListItemText>
    </ListItem>
}