
import * as React from 'react'

import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton, TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ConstructionIcon from '@mui/icons-material/Construction'
import EditIcon from '@mui/icons-material/Edit'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'


import {AppActions, BoardActions, selectAppMode, selectBoardState, useThunkDispatch, useTypedSelector} from '../store'
import {createClasses} from '@axwt/util'
import {AppMode} from '@axwt/sudoku/data'

const boardTitleBarClasses = createClasses("BoardTitleBar", ['button', 'menu', 'modeSelector', 'spacer', 'title'])

export const BoardTitleBar: React.FC = () => {

    const boardState = useTypedSelector(selectBoardState)
    const currentMode = useTypedSelector(selectAppMode)
    const dispatch = useThunkDispatch()

    const [nameDialogOpen, setNameDialogOpen] = React.useState<boolean>(false)

    const handleChangeMode = (mode: AppMode) => () => dispatch(AppActions.setMode(mode))

    const handleClickTitle = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.currentTarget.focus()
    }

    const classes = boardTitleBarClasses
    return <Box
        className={classes.root}
        sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%', height: '36px',
            borderBottom: 1,
            borderBottomColor: 'divider',

            [`& .${classes.button}`]: {

            },
            [`& .${classes.menu}`]: {
                width: '150px',
            },
            [`& .${classes.modeSelector}`]: {
                "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                }
            },
            [`& .${classes.spacer}`]: {
                flex: '1 0 0',
            },
            [`& .${classes.title}`]: {
                fontWeight: 'bold',
                paddingX: 1,
                marginX: 1,
                paddingTop: .5,
                cursor: 'pointer',
            },
        }}
    >
        <div
            className={classes.title}
            tabIndex={0}
            onClick={() => setNameDialogOpen(true)}
        >{boardState.boardName}</div>
        <NameDialog
            open={nameDialogOpen}
            onClose={() => setNameDialogOpen(false)}
            name={boardState.boardName}
            onChangeName={(newName) => dispatch(BoardActions.setName(newName))}/>
        <div className={classes.spacer}></div>

        <ToggleButtonGroup
            className={classes.modeSelector}
            size="small"
        >
            <Tooltip title="Define Mode">
                <ToggleButton
                    value="Define" size="small"
                    selected={currentMode == 'Define'}
                    onChange={handleChangeMode('Define')}
                >
                    <EditIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
            <Tooltip title="Game Mode">
                <ToggleButton
                    value="Play" size="small"
                    selected={currentMode == 'Play'}
                    onChange={handleChangeMode('Play')}
                >
                    <SportsEsportsIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
            <Tooltip title="Solve Mode">
                <ToggleButton
                    value="Solve" size="small"
                    selected={currentMode == 'Solve'}
                    onChange={handleChangeMode('Solve')}
                >
                    <ConstructionIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
        </ToggleButtonGroup>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }}/>
        <Tooltip title="Close Board">
            <IconButton size="small" onClick={() => dispatch(AppActions.closeBoard())}>
                <CloseIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
    </Box>
}

export default BoardTitleBar



export interface NameDialogProps {
    open: boolean
    onClose: () => void

    name: string
    onChangeName: (title: string) => void
}



export const NameDialog: React.FC<NameDialogProps> = ({open, onClose, name, onChangeName}) => {

    const [newName, setNewName] = React.useState<string>(name)

    const handleSave = () => {
        onClose()
        onChangeName(newName)
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Set Board Name</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Board Name"
                fullWidth
                variant="standard"
                value={newName}
                onChange={(ev) => setNewName(ev.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
        </DialogActions>
    </Dialog>
}


