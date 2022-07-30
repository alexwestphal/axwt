/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box} from '@mui/material'

import {cls} from '@axwt/util'

export interface PanelNotAvailableProps {
    reason: string
}

export const PanelNotAvailable: React.FC<PanelNotAvailableProps> = ({reason}) => {

    return <Box
        className={cls("PanelNotAvailable")}
        padding={2}
    >
        {reason}
    </Box>
}

export default PanelNotAvailable