
import * as React from 'react'

import {Box, CircularProgress} from '@mui/material'
import {cls, createClasses} from '@axwt/util'


export const axwtClasses = createClasses("AXWT", ["body", "loading"])

export const AXWT: React.FC = (props) => {

    return <Box sx={ theme => ({

        [`& .${axwtClasses.body}`]: {
            width: '100%',
            height: `calc(100vh - ${theme.banner.height}px)`,
            marginTop: `${theme.banner.height}px`,
            flexGrow: 1,
            flexBasis: 0,

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
        },

        [`& .${axwtClasses.loading}`]: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }

    })}>{props.children}</Box>
}

export default AXWT


export interface BodyProps {
}

export const Body: React.FC<BodyProps> = ({children}) => {

    return <div className={axwtClasses.body}>{children}</div>
}


export const Loading: React.FC = () => {

    return <div className={cls(axwtClasses.body, axwtClasses.loading)}>
        <CircularProgress size={200}/>
    </div>
}