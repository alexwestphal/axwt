/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {createClasses} from '@axwt/util'
import { InputAdornment, TextField} from '@mui/material'

import SolidBoxIcon from '@axwt/core/icons/SolidBox'


export interface ColorFieldProps {
    label: string
    value: string
    onChange: (newValue: string) => void
}

const colorFieldClasses = createClasses("ColorField", [])

export const ColorField: React.FC<ColorFieldProps> = (props) => {


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.trim()

        if(value.startsWith("#")) {
            // Hex color
            value = "#" + value.substring(1).toLowerCase().replaceAll(/[^\da-f]/g, '').substring(0, 6)
        }

        props.onChange(value)
    }

    return <>

        <TextField
            variant="standard"
            fullWidth
            label={props.label}
            value={props.value}
            onChange={handleChange}
            InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ color: 'unset' }}>
                    <SolidBoxIcon sx={{ fill: props.value ?? 'black' }}/>
                </InputAdornment>
            }}
        />

    </>
}

export default ColorField