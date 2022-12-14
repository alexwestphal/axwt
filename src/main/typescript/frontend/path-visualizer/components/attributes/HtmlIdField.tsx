
import * as React from 'react'

import {Box, inputClasses, inputLabelClasses, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'

import {Element} from '../../data'
import {ElementsActions, useThunkDispatch} from '@axwt/path-visualizer/store'


export interface HtmlIdFieldProps {
    element: Element
}

const htmlIdFieldsClasses = createClasses("HtmlIdField", [])

export const HtmlIdField: React.FC<HtmlIdFieldProps> = ({element}) => {

    const dispatch = useThunkDispatch()

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        let str = ev.target.value
        str = str.replaceAll(/\s+/g, '-')

        if(str != element.htmlId)
            dispatch(ElementsActions.setHtmlId(element.elementId, str))
    }

    const classes = htmlIdFieldsClasses

    return <Box className={classes.root}>
        <TextField
            variant="standard"
            fullWidth
            label="id"
            value={element.htmlId || ""}
            onChange={handleChange}
        />
    </Box>
}

export default HtmlIdField