/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box,
    Button,
    Checkbox,
    ClickAwayListener,
    Container,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    outlinedInputClasses,
    Paper,
    Popper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import {blueGrey, grey} from '@mui/material/colors'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import {cls, createClasses} from '@axwt/util'

import {axwtClasses} from '@axwt/core'

import {Users} from '../data'


export const userListClasses = createClasses("UserList", ["container", "header", "searchBox", "tableHeadCell", "tableHeadCellInner", "tableHeadCellMoreIcon", "tableHeadCellText", "title"])

export const UserList: React.FC = () => {

    const classes = userListClasses

    return <Box
        className={cls(classes.root, axwtClasses.body)}
        sx={{
            backgroundColor: blueGrey[50],

            [`& .${classes.container}`]: {
                paddingY: 1
            },

            [`& .${classes.header}`]: {
                marginY: 2,
                display: 'flex',
                alignItems: 'center'
            },
            [`& .${classes.searchBox}`]: {
                flexGrow: 1,
                marginX: 2,
                backgroundColor: 'background.paper',

                [`& .${outlinedInputClasses.input}`]: {
                    paddingY: 1
                },
            },

            [`& .${classes.title}`]: {
                typography: 'h6',
                marginRight: 4
            },
        }}
    >
        <Container className={classes.container}>
            <div className={classes.header}>
                <div className={classes.title}>Users & Groups: Users</div>
                <TextField
                    className={classes.searchBox}
                    variant="outlined"
                    placeholder="Search"
                    autoFocus
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon/>
                            </IconButton>
                            <IconButton edge="end">
                                <MoreVertIcon/>
                            </IconButton>
                        </InputAdornment>
                    }}
                />
                <Button variant="contained">Add User</Button>
            </div>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Login</TableCell>
                            <TableCell>Organization</TableCell>
                            <ColumnFilterHeadCell columnName="Role" values={["Manager", "User", "Instructor", "Tester"]}/>

                            <ColumnFilterHeadCell columnName="Status" values={["Active", "Inactive", "Record"]}/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Users.map(user =>
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{`${user.lastName}, ${user.firstName}`}</TableCell>
                                <TableCell>{user.login}</TableCell>
                                <TableCell>{user.org}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </Box>
}

export default UserList


interface ColumnFilterHeadCellProps {
    columnName: string
    values: string[]
}

const columnFilterHeadCellClasses = createClasses("ColumnFilterHeadCell", ["inner", "moreIcon", "text"])

const ColumnFilterHeadCell: React.FC<ColumnFilterHeadCellProps> = ({columnName, values}) => {

    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLElement | null>(null)

    const handleClick: React.MouseEventHandler<HTMLElement> = (ev) => {
        setPopperAnchorEl(popperAnchorEl ? null : ev.currentTarget)
    }

    const classes = columnFilterHeadCellClasses

    return <ClickAwayListener onClickAway={() => setPopperAnchorEl(null)}>

        <TableCell
            className={classes.root}
            onClick={handleClick}
            sx={{

                [`& .${classes.inner}`]: {
                    display: 'flex',
                    alignItems: 'center',
                },

                [`& .${classes.moreIcon}`]: {
                    visibility: 'none'
                },

                [`& .${classes.text}`]: {
                    flexGrow: 1
                },

                "&:hover": {
                    backgroundColor: grey[100],
                    cursor: 'pointer',

                    [`& .${classes.moreIcon}`]: {
                        visibility: 'visible'
                    },
                },
            }}
        >
            <div className={classes.inner}>
                <div className={classes.text}>{columnName}</div>
                <ExpandMoreIcon className={classes.moreIcon} fontSize="small"/>
            </div>
            <Popper
                open={Boolean(popperAnchorEl)}
                onClick={ev => ev.stopPropagation()}
                anchorEl={popperAnchorEl}
                placement="bottom-end"
            >
                <Paper square>
                    <List
                        subheader={<ListSubheader>Show Only</ListSubheader>}
                    >
                        { values.map(value =>
                            <ListItem key={value} disablePadding>
                                <ListItemButton dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText>{value}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Popper>
        </TableCell>
    </ClickAwayListener>
}