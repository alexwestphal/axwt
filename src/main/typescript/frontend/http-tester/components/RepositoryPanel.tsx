
import * as React from 'react'

import {List, ListItemButton, ListItemText} from '@mui/material'

import {selectAllSavedRequests, selectCurrentDraft, useTypedSelector} from '../store'

export const RepositoryPanel: React.FC = () => {

    const currentDraft = useTypedSelector(selectCurrentDraft)
    const requests = useTypedSelector(state => selectAllSavedRequests(state))

    const handleItemClick = () => {}

    return <List>
        {requests.map(request => <ListItemButton
            key={request.requestId}
            selected={request.requestId == currentDraft.requestId}
            onClick={handleItemClick}
        >
            <ListItemText primary={request.name}/>
        </ListItemButton>)}
    </List>
}

export default RepositoryPanel