
import * as React from 'react'

import {Box, Button, CircularProgress, Tooltip} from '@mui/material'
import {green} from '@mui/material/colors'

import CheckIcon from '@mui/icons-material/Check'
import SaveIcon from '@mui/icons-material/Save'

import {cls, createClasses} from '@axwt/util'

import {CommunicationStatus} from '../store'


export interface SaveButtonProps {
    title: string
    saveStatus: CommunicationStatus
    onClick: () => void

    children: {
        Ready: string,
        InProgress: string,
        Done: string,
        Error: string
    }
}

const Classes = createClasses("SaveButton", ["ready", "inProgress", "done"])

export const SaveButton: React.FC<SaveButtonProps> = ({ title, saveStatus, onClick, children }) => {

    const handleClick = () => {
        if(saveStatus == 'Ready') onClick()
    }

    return <Box
        className={cls("SaveButton", {
            [Classes.ready]: saveStatus == 'Ready',
            [Classes.inProgress]: saveStatus == 'InProgress',
            [Classes.done]: saveStatus == 'Done'
        })}
        sx={{
            position: 'relative',
            ml: 1, mr: 2,

            '& .MuiButton-root': {
                color: 'inherit'
            },

            '& .MuiCircularProgress-root': {
                position: 'absolute',
                top: '50%', left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
                color: green[500]
            },

            [`&.${Classes.done} .MuiButton-root`]: {
                backgroundColor: green[500],
                ':hover': {
                    backgroundColor: green[700]
                }
            }
        }}
    >
        <Tooltip title={title}>
            <span>
                <Button
                    disabled={saveStatus == 'InProgress'}
                    startIcon={saveStatus == 'Done' ? <CheckIcon/> : <SaveIcon/>}
                    onClick={handleClick}
                >{children[saveStatus]}</Button>
            </span>
        </Tooltip>
        { saveStatus == 'InProgress' && <CircularProgress size={24}/> }
    </Box>
}

export default SaveButton