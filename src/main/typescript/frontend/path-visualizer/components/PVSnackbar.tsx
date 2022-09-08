/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {IconButton, Snackbar} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import {AppActions, useThunkDispatch, useTypedSelector} from '../store'
import {selectSnackbar} from '../store'


export const PVSnackbar: React.FC = () => {

    const options = useTypedSelector(selectSnackbar)

    const dispatch = useThunkDispatch()

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if(reason === 'clickaway') return // Ignore clickaway

        dispatch(AppActions.snackbarUnset())
    }

    return <Snackbar
        open={Boolean(options)}
        message={options?.message ?? ""}
        onClose={handleClose}
        autoHideDuration={6000}
        action={<IconButton
            size="small"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon/>
        </IconButton>}
    />
}

export default PVSnackbar