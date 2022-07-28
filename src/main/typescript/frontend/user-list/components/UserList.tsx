/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box,
    Button,
    Checkbox,
    ClickAwayListener,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader, MenuItem, OutlinedInput,
    Paper,
    Popper, Select, SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, tableRowClasses, Tooltip,
} from '@mui/material'
import {blueGrey, grey} from '@mui/material/colors'

import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'

import {cls, createClasses} from '@axwt/util'

import {axwtClasses} from '@axwt/core'

import {getUser, Orgs, Users} from '../data'


export const userListClasses = createClasses("UserList", ["container", "header", "searchBoxContainer", "tableHeadCell", "tableHeadCellInner", "tableHeadCellMoreIcon", "tableHeadCellText", "title"])

export const UserList: React.FC = () => {

    const [shownRoles, setShownRoles] = React.useState<{ [key: string]: boolean }>({
        Users: true, Managers: true, Records: true, Instructors: true, Testers: true
    })
    const [shownStatuses, setShownStatuses] = React.useState<{ [key: string]: boolean }>({
        Active: true, Inactive: true, Record: true
    })
    const [shownOrgs, setShownOrgs] = React.useState<string[]>([])


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
            [`& .${classes.searchBoxContainer}`]: {
                position: 'relative',
                flexGrow: 1,
                marginX: 2,
                alignSelf: 'start',
            },

            [`& .${classes.title}`]: {
                typography: 'h6',
                marginRight: 4
            },

            [`& .${tableRowClasses.root}:not(.${tableRowClasses.head})`]: {

                "&:hover": {
                    backgroundColor: 'action.hover'
                }
            }
        }}
    >
        <Container className={classes.container}>
            <div className={classes.header}>
                <div className={classes.title}>Users & Groups: Users</div>
                <div className={classes.searchBoxContainer}>
                    <SearchBox/>
                </div>
                <Button variant="contained" startIcon={<AddIcon/>}>Add User</Button>
            </div>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Login</TableCell>
                            <ColumnSelectHeadCell columnName="Organization" possibleValues={Orgs} selectedValues={shownOrgs} onChange={setShownOrgs}/>
                            <ColumnFilterHeadCell columnName="Role" values={shownRoles} onChange={setShownRoles}/>

                            <ColumnFilterHeadCell columnName="Status" values={shownStatuses} onChange={setShownStatuses}/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Users.map(user =>
                            <TableRow key={user.userId}>
                                <TableCell align="right">{user.userId}</TableCell>
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


interface SearchBoxProps {

}

const searchBoxClasses = createClasses("SearchBox", ["divider", "focus", "input", "main", "recentList", "recentList_id", "targetField", "verticalDivider"])

const SearchBox: React.FC<SearchBoxProps> = ({}) => {

    const [filterDialogOpen, setFilterDialogOpen] = React.useState<boolean>(false)
    const [searchText, setSearchText] = React.useState<string>("")
    const [targetField, setTargetField] = React.useState<string>("last_name")

    const [hasFocus, setHasFocus] = React.useState<boolean>(false)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        setSearchText(ev.target.value.trimStart())
    }

    const classes = searchBoxClasses

    return <>
        <ClickAwayListener onClickAway={() => setHasFocus(false)}>
            <Paper
                className={cls(classes.root, { [classes.focus]: hasFocus })}
                component="form"
                elevation={hasFocus ? 1 : 0}
                onFocus={() => setHasFocus(true)}
                sx={{
                    width: '100%',
                    position: 'absolute',

                    padding: '1px 2px',
                    border: 1,
                    borderColor: grey[400],

                    "&:hover": {
                        borderColor: 'primary.main',
                    },

                    [`&.${classes.focus}`]: {
                        padding: '0px 1px',
                        border: 2,
                        borderColor: 'primary.main',
                    },
                    [`& .${classes.divider}`]: {
                        width: '100%',
                    },
                    [`& .${classes.input}`]: {
                        marginLeft: 1,
                        flex: 1,
                    },
                    [`& .${classes.main}`]: {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    [`& .${classes.recentList}`]: {

                    },
                    [`& .${classes.recentList_id}`]: {
                        display: 'inline-block',
                        width: '4em',
                        marginRight: 2,
                    },
                    [`& .${classes.targetField}`]: {
                        marginX: 2, marginY: 1
                    },
                    [`& .${classes.verticalDivider}`]: {
                        height: 28,
                        margin: 1/2,
                    },
                }}
            >
                <div className={classes.main}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Users"
                        value={searchText}
                        onChange={handleChange}
                    />
                    <Tooltip title="Do Search">
                        <IconButton size="small">
                            <SearchIcon/>
                        </IconButton>
                    </Tooltip>
                    <Divider className={classes.verticalDivider} orientation="vertical" />
                    <Tooltip title="Filter Options">
                        <IconButton size="small" onClick={() => setFilterDialogOpen(true)}>
                            <FilterIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                {hasFocus && <>
                    <Divider orientation="horizontal"/>
                    <List
                        className={classes.recentList}
                        dense
                        subheader={<ListSubheader disableGutters sx={{ pl: 1 }}>Recent</ListSubheader>}
                    >
                        {[12022,12033].map(getUser).map(user =>
                            <ListItem key={user.userId} disableGutters disablePadding>
                                <ListItemButton>
                                    <ListItemText>
                                        <span className={classes.recentList_id}>{user.userId}</span>
                                        {`${user.lastName}, ${user.firstName}`}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </>}
            </Paper>
        </ClickAwayListener>
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
            <DialogTitle>Filter Options</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
                <Button onClick={() => setFilterDialogOpen(false)}>Apply</Button>
            </DialogActions>
        </Dialog>
    </>
}


interface ColumnFilterHeadCellProps {
    columnName: string
    values: { [key: string]: boolean }
    onChange: (newValues: { [key: string]: boolean }) => void
}

const columnFilterHeadCellClasses = createClasses("ColumnFilterHeadCell", ["inner", "moreIcon", "text"])

const ColumnFilterHeadCell: React.FC<ColumnFilterHeadCellProps> = ({columnName, values, onChange}) => {

    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLElement | null>(null)

    const handleCellClick: React.MouseEventHandler<HTMLElement> = (ev) => {
        setPopperAnchorEl(popperAnchorEl ? null : ev.currentTarget)
    }

    const handleToggle = (value: string) => () => {
        let newValues = { ...values, [value]: !values[value] }
        onChange(newValues)
    }

    const classes = columnFilterHeadCellClasses

    return <ClickAwayListener onClickAway={() => setPopperAnchorEl(null)}>

        <TableCell
            className={classes.root}
            onClick={handleCellClick}
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
                placement="bottom-start"
                sx={{
                    width: popperAnchorEl ? popperAnchorEl.clientWidth : 'unset'
                }}
            >
                <Paper square>
                    <List
                        subheader={<ListSubheader disableGutters sx={{ pl: 1 }}>Show Only</ListSubheader>}
                    >
                        { Object.keys(values).map(value =>
                            <ListItem key={value} disablePadding>
                                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            checked={values[value]}
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


interface ColumnSelectHeadCellProps {
    columnName: string
    possibleValues: string[]
    selectedValues: string[]
    onChange: (newValues: string[]) => void
}

const columnSelectHeadCellClasses = createClasses("ColumnSelectHeadCell", ["inner", "moreIcon", "text"])

const ColumnSelectHeadCell: React.FC<ColumnSelectHeadCellProps> = ({columnName, possibleValues, selectedValues, onChange}) => {

    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLElement | null>(null)

    const handleCellClick: React.MouseEventHandler<HTMLElement> = (ev) => {
        setPopperAnchorEl(popperAnchorEl ? null : ev.currentTarget)
    }

    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as unknown as string[])
    }

    const classes = columnSelectHeadCellClasses

    return <ClickAwayListener onClickAway={() => setPopperAnchorEl(null)}>

        <TableCell
            className={classes.root}
            onClick={handleCellClick}
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
                placement="bottom-start"
                sx={{
                    width: popperAnchorEl ? popperAnchorEl.clientWidth : 'unset'
                }}
            >
                <Paper square>
                    <Select
                        multiple fullWidth
                        value={selectedValues as any}
                        onChange={handleChange}
                        input={<OutlinedInput label={columnName}/>}
                    >
                        {possibleValues.map(value =>
                            <MenuItem key={value} value={value}>{value}</MenuItem>
                        )}
                    </Select>
                </Paper>
            </Popper>
        </TableCell>
    </ClickAwayListener>
}