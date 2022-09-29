
import React from 'react'
import {Redirect} from 'react-router-dom'

import {Box, Container, Paper} from '@mui/material'
import {blueGrey} from '@mui/material/colors'
import ArchitectureIcon from '@mui/icons-material/ArchitectureOutlined'
import PeopleIcon from '@mui/icons-material/PeopleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

import {DisplayActions, useThunkDispatch} from '@axwt/core/store'
import {cls, createClasses} from '@axwt/util'

import {axwtClasses} from './AXWT'


const dashboardClasses = createClasses("Dashboard", ["container", "module", "moduleIcon", "moduleText"])

export const Dashboard: React.FC = () => {

    const [redirect, setRedirect] = React.useState<string>(null)

    const dispatch = useThunkDispatch()

    React.useEffect(() => {
        dispatch(DisplayActions.setTitle(""))
    })

    const classes = dashboardClasses

    return <Box
        className={cls(classes.root, axwtClasses.body)}
        sx={{
            padding: 2,
            backgroundColor: blueGrey[50],

            [`& .${classes.container}`]: {
                display: 'flex',
                flexWrap: 'wrap',
            },

            [`& .${classes.module}`]: {
                width: '150px', height: '150px',
                padding: 1, margin: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
            [`& .${classes.moduleIcon}`]: {
                fontSize: '5rem'
            },
            [`& .${classes.moduleText}`]: {
                paddingTop: 1,
                textDecoration: 'none'
            },
    }}>
        <Container className={classes.container}>
            <Paper className={classes.module} square onClick={() => setRedirect("/http-tester")}>
                <SwapHorizIcon className={classes.moduleIcon}/>
                <div className={classes.moduleText}>HTTP Tester</div>
            </Paper>
            <Paper className={classes.module} square onClick={() => setRedirect("/path-visualizer")}>
                <ArchitectureIcon className={classes.moduleIcon}/>
                <div className={classes.moduleText}>Path Visualizer</div>
            </Paper>
            <Paper className={classes.module} square onClick={() => setRedirect("/user-list")}>
                <PeopleIcon className={classes.moduleIcon}/>
                <div className={classes.moduleText}>User List</div>
            </Paper>
        </Container>
        {redirect && <Redirect push to={redirect}/>}
    </Box>
}

export default Dashboard