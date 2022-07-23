
import * as React from 'react'
import {Box, Button, ButtonProps, CircularProgress, Tooltip} from '@mui/material'

import {cls} from '@axwt/util'

type ButtonState = 'Ready' | 'InProgress' | 'Done'


export type SpinnerButtonProps = Omit<ButtonProps, 'onClick' | 'children'> & {

    /**
     * Click handler. If a promise is returned, it is used to transition from 'InProgress' to 'Done'.
     */
    onClick: () => (Promise<void> | void)

    /**
     * The button text. An object can be provided to have different text depending on the state.
     */
    children: string | {
        Ready: string,
        InProgress: string,
        Done: string
    }

    /**
     * Reset the state to 'Ready' (rather than 'Done') when the promise resolves.
     * @default false
     */
    reset?: boolean

    title?: string
}

export const SpinnerButton: React.FC<SpinnerButtonProps> = ({onClick, children, reset, title, ...props}) => {

    const [state, setState] = React.useState<ButtonState>('Ready')

    const handleClick = () => {
        if(state == 'Ready') {
            setState('InProgress')

            let onClickResult = onClick()
            if(onClickResult instanceof Promise) {
                onClickResult.then(() => {
                    setState(reset ? 'Ready' :'Done')
                })
            }
        }
    }

    let button = <Box className={cls("SpinnerButton")} sx={{
        position: 'relative',

        '& .MuiCircularProgress-root': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px'
        }
    }}>
        <Button
            onClick={handleClick}
            disabled={props.disabled || state != 'Ready'}
            {...props}
        >
            {(typeof children === 'string' || children instanceof String) ? children : children[state]}
        </Button>
        {state == 'InProgress' && <CircularProgress size={24}/>}
    </Box>

    if(title) return <Tooltip title={title}>{button}</Tooltip>
    else return button
}

export default SpinnerButton