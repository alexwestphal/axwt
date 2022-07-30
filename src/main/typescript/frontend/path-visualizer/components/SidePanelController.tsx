/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, IconButton, MenuItem, Select, SxProps, TextField} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SettingsIcon from '@mui/icons-material/Settings'

import {createClasses} from '@axwt/util'


export interface SidePanelControllerProps {
    side: 'Left' | 'Right'
    className?: string
    sx?: SxProps
    panels: (SidePanelControllerProps.PanelSpec)[]
}
export namespace SidePanelControllerProps {
    export interface PanelSpec {
        title: string
        value: string
        Component: React.ComponentType
        available?: boolean
    }
}

const sidePanelControllerClasses = createClasses("CompactPanel", ["panelContents", "titleBar", "titleBar_controls", "titleBar_spacer", "titleBar_panelSelector"])

export const SidePanelController: React.FC<SidePanelControllerProps> = ({className, panels, side, sx = []}) => {
    panels = panels.filter(panel => !!panel) as SidePanelControllerProps.PanelSpec[]

    const [activePanelKey, setActivePanelKey] = React.useState(panels.length > 0 ? panels[0].value : null)
    const activePanel = activePanelKey && panels.find(panel => panel.value == activePanelKey)

    React.useEffect(() => {
        // Reset the active panel (if required)
        if(!activePanel) setActivePanelKey(panels.length > 0 ? panels[0].value : null)
    }, [panels])

    const classes = sidePanelControllerClasses

    return <Box
        className={classes.root + (className ? ' ' + className : '')}
        sx={[
            {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',

                [`& .${classes.panelContents}`]: {
                    overflowY: 'auto',
                    flex: '1 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                },
                [`& .${classes.titleBar}`]: theme => ({
                    borderBottom: 1,
                    borderBottomColor: 'divider',
                    boxShadow: theme.shadows[1],

                    display: 'flex',
                    alignItems: 'center'
                }),
                [`& .${classes.titleBar_controls}`]: {

                },
                [`& .${classes.titleBar_spacer}`]: {
                    flexGrow: 1,
                },
                [`& .${classes.titleBar_panelSelector}`]: {
                    marginBottom: '-1px',
                    minWidth: '8em',

                    "& .MuiSelect-select": {
                        paddingX: 1,
                        paddingTop: 1,
                    },

                    "& .MuiInput-underline:before": {
                        borderBottomWidth: 0
                    }
                },
            },
            ...(Array.isArray(sx) ? sx : [sx])
        ]}
    >
        <div className={classes.titleBar}>
            <TextField
                className={classes.titleBar_panelSelector}
                size="small" variant="standard" select
                value={activePanelKey ?? ""}
                onChange={ev => setActivePanelKey(ev.target.value)}
            >
                {panels.map(panel =>
                    <MenuItem key={panel.value} value={panel.value}>{panel.title}</MenuItem>
                )}
            </TextField>
            <div className={classes.titleBar_spacer}></div>
            <div className={classes.titleBar_controls}>
                <IconButton size="small">
                    <SettingsIcon/>
                </IconButton>
                <IconButton size="small">
                    { side == 'Left' ? <ChevronLeftIcon/> : <ChevronRightIcon/> }
                </IconButton>
            </div>
        </div>
        <div className={classes.panelContents}>
            {activePanel && React.createElement(activePanel.Component, {})}
        </div>
    </Box>
}

export default SidePanelController