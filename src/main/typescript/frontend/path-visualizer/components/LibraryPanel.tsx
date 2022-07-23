/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material'

import * as Icons from '@mui/icons-material'

import {createClasses} from '@axwt/util'

import {ElementsActions, selectElements, useThunkDispatch, useTypedSelector} from '../store'


const libraryPanelClasses = createClasses("LibraryPanel", [])

export const LibraryPanel: React.FC = () => {

    const ref = React.useRef<HTMLDivElement>(null)
    const [loadIcons, setLoadIcons] = React.useState(false)
    React.useEffect(() => {
        setTimeout(() => setLoadIcons(true), 100)
    }, [])

    const icons = Object.entries(Icons).filter(([name]) => !name.match(/Outlined|Rounded|Sharp|TwoTone$/))


    const dispatch = useThunkDispatch()

    const handleClickIcon = (name) => {
        let path = ref.current.querySelector(`.Library-${name} .MuiSvgIcon-root path`)
        let importAction = dispatch(ElementsActions.importPath(path.getAttribute("d")))
        dispatch(ElementsActions.setCurrentElement({ elementType: 'path', elementId: importAction.meta.newElementId }))
    }

    const classes = libraryPanelClasses

    return <Box className={classes.root} ref={ref}>
        <List>
            {loadIcons
                ? icons.map(([name, Icon], index) => <ListItem key={index} className={`Library-${name}`}>
                    <ListItemButton onClick={() => handleClickIcon(name)}>
                        <ListItemIcon><Icon/></ListItemIcon>
                        <ListItemText primary={name}/>
                    </ListItemButton>
                </ListItem>)
                : <CircularProgress/>
            }

        </List>
    </Box>
}

export default LibraryPanel