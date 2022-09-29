
import * as React from 'react'

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material'

import {DraftRequest} from '../data'
import {RepositoryActions, useThunkDispatch} from '../store'

export interface SaveButtonProps {
    request: DraftRequest
}

export const SaveRequestButton: React.FC<SaveButtonProps> = ({request}) => {

    const dispatch = useThunkDispatch()

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [requestName, setRequestName] = React.useState("")

    const handleClick = () => {
        if(request.saved) {
            // Request has previously been saved
            dispatch(RepositoryActions.saveRequest(request))
        } else {
            // Request has not yet been saved
            setDialogOpen(true)
        }
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setRequestName("")
    }

    const handleSaveAs = () => {
        dispatch(RepositoryActions.saveRequest({...request, name: requestName}))
        handleCloseDialog()
    }

    return <>
        <Button
            variant="outlined"
            disabled={request.saved && !request.dirty }
            onClick={handleClick}
        >{request.saved ? 'Save' : 'Save As'}</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Save As</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label={"Request Name"}
                    fullWidth
                    variant="standard"
                    value={requestName}
                    onChange={(ev) => setRequestName(ev.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleSaveAs}>Save</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default SaveRequestButton