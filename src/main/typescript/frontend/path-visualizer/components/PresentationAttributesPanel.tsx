/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, Grid, inputClasses, inputLabelClasses, MenuItem, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'

import {PresentationAttributes} from '../data'
import {ElementsActions, selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'

import ColorField from './ColorField'
import HtmlIdField from './HtmlIdField'



export const presentationAttributesPanelClasses = createClasses("PresentationAttributesPanel", [])

export const PresentationAttributesPanel: React.FC = () => {

    const element = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const handleChange = (attrName: keyof PresentationAttributes) => (newValue: string) => {
        if(newValue == "") newValue = null

        if(newValue != element.presentation[attrName]) {
            // Value has changed
            dispatch(ElementsActions.setPresentationAttribute(element.elementId, attrName, newValue))
        }
    }

    const classes = presentationAttributesPanelClasses

    return <Box
        className={classes.root}
        sx={{
            [`& .${inputClasses.input}`]: {
                paddingTop: 1/2,
                paddingX: 1
            },
            [`& .${inputLabelClasses.root}`]: {
                paddingTop: 1/2,
                paddingX: 1
            },
        }}
    >
        <HtmlIdField element={element}/>
        <Grid container>
            <Grid item xs={4}>
                <ColorField
                    label="fill"
                    value={element.presentation['fill']}
                    onChange={handleChange('fill')}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="standard"
                    fullWidth
                    label="fill-opacity"
                    value={element.presentation['fill-opacity']}
                    onChange={(ev) => handleChange('fill-opacity')(ev.target.value)}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="standard"
                    fullWidth
                    label="fill-rule"
                    select
                    value={element.presentation['fill-rule'] ?? ""}
                    onChange={(ev) => handleChange('fill-rule')(ev.target.value)}
                    SelectProps={{
                        renderValue: (value) => value || ""
                    }}
                >
                    <MenuItem value="" sx={{ color: 'text.secondary' }}>undefined</MenuItem>
                    <MenuItem value="nonzero">nonzero</MenuItem>
                    <MenuItem value="evenodd">evenodd</MenuItem>
                    <MenuItem value="inherit">inherit</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <ColorField
                    label="stroke"
                    value={element.presentation['stroke']}
                    onChange={handleChange('stroke')}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="standard"
                    fullWidth
                    label="stroke-opacity"
                    value={element.presentation['stroke-opacity']}
                    onChange={(ev) => handleChange('stroke-opacity')(ev.target.value)}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="standard"
                    fullWidth
                    label="stroke-width"
                    value={element.presentation['stroke-width']}
                    onChange={(ev) => handleChange('stroke-width')(ev.target.value)}
                />
            </Grid>
        </Grid>
    </Box>
}

export default PresentationAttributesPanel