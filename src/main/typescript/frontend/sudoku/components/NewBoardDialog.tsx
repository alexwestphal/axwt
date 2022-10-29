import * as React from 'react'

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material'

import {BoardSize, BoardType} from '../data'
import { BoardActions, useThunkDispatch} from '../store'

export interface NewBoardDialogProps {
    open: boolean
    onClose: () => void
}

export const NewBoardDialog: React.FC<NewBoardDialogProps> = ({open, onClose}) => {

    const dispatch = useThunkDispatch()

    const [boardName, setBoardName] = React.useState<string>("")
    const [boardType, setBoardType] = React.useState<BoardType>('Standard')
    const [boardSize, setBoardSize] = React.useState<BoardSize>(3)

    const handleClose = () => {
        onClose()
        setBoardName("")
        setBoardType('Standard')
        setBoardSize(3)
    }

    const handleCreate = () => {
        dispatch(BoardActions.newBoard(boardName, boardType, boardSize))
        handleClose()
    }

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Board Name"
                fullWidth
                variant="standard"
                value={boardName}
                onChange={(ev) => setBoardName(ev.target.value)}
            />
            <TextField
                margin="dense"
                label="Board Type"
                fullWidth select
                variant="standard"
                value={boardType}
                onChange={(ev) => setBoardType(ev.target.value as BoardType)}
            >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Killer" disabled>Killer</MenuItem>
            </TextField>
            <TextField
                margin="dense"
                label="Board Size"
                fullWidth select
                variant="standard"
                value={boardSize}
                onChange={(ev) => setBoardSize(parseInt(ev.target.value) as BoardSize)}
            >
                <MenuItem value="3">3 (9&#x2E3;9)</MenuItem>
                <MenuItem value="4" disabled>4 (16&#x2E3;16)</MenuItem>
                <MenuItem value="5" disabled>4 (25&#x2E3;25)</MenuItem>
            </TextField>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
    </Dialog>
}

export default NewBoardDialog