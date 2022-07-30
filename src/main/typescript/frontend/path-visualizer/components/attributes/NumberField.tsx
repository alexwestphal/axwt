/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'


import {TextField} from '@mui/material'

import {createClasses} from '@axwt/util'


export interface NumberFieldProps {
    label: string
    value: number
    onChange: (newValue: number) => void
}

const numberFieldClasses = createClasses("NumberField", [])

export const NumberField: React.FC<NumberFieldProps> = (props) => {

    const [currentValue, setCurrentValue] = React.useState("")

    React.useEffect(() => setCurrentValue(props.value == null ? null : ''+props.value), [props.value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let str = event.target.value
        let negated = str.length > 0 && str.charAt(0) == '-' // Check if the number is negative

        str = str.replaceAll(/[^\d.]/g, '')

        let decimalIndex = str.indexOf('.')
        if(decimalIndex >= 0) {
            // Replace any subsequent occurrences of '.'
            str = str.substring(0, decimalIndex+1) + str.substring(decimalIndex+1).replaceAll('.', '')
        }

        if(negated) str = '-' + str // Put the '-' back on (if required)
        setCurrentValue(str)

        if(str === "" && props.value != null) {
            props.onChange(null)
        } else {
            let asNumber = parseFloat(str)
            if(!isNaN(asNumber) && asNumber != props.value) props.onChange(asNumber)
        }
    }

    const handleBlur = () => {
        setCurrentValue(props.value == null ? null : ''+props.value)
    }

    return <>
        <TextField
            variant="standard"
            fullWidth
            label={props.label}
            value={currentValue ?? ""}
            onBlur={handleBlur}
            onChange={handleChange}
        />
    </>
}

export default NumberField