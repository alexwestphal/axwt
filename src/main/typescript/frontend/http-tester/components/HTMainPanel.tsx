
import * as React from 'react'

import {Box} from '@mui/material'

import {PanelSizingProps, StyledPaper} from '@axwt/core'

import RequestSheet from './RequestSheet'


export const HTMainPanel: React.FC<PanelSizingProps> = () => {

    return <Box margin={2}>
        <RequestSheet/>
        <StyledPaper title="Response" titleProps={{ variant: "h5" }}>

        </StyledPaper>
    </Box>
}

export default HTMainPanel