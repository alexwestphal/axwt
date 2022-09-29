
import * as React from 'react'

import {Button, Checkbox, IconButton, MenuItem, TextField, Typography} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'


import {StyledPaper} from '@axwt/core'
import {createClasses} from '@axwt/util'

import {Method} from '../data'
import {DraftActions, selectCurrentDraft, useThunkDispatch, useTypedSelector} from '../store'

import SaveRequestButton from './SaveRequestButton'

const requestSheetClasses = createClasses("RequestSheet", ["header", "header_equals", "header_name", "header_value", "headers", "queryParam", "queryParam_equals", "queryParam_name", "queryParam_value", "queryParams", "section", "sectionTitle", "urlLine"])

export const RequestSheet: React.FC = () => {

    const request = useTypedSelector(selectCurrentDraft)
    const dispatch = useThunkDispatch()

    const handleChangeUrl: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        let newValue = ev.target.value
        if(newValue !== request.url) {
            // Only dispatch if the url has actually changed
            dispatch(DraftActions.setUrl(newValue))
        }
    }

    const handleClickSave = () => {

    }

    const classes = requestSheetClasses
    return request && <StyledPaper
        title="Request"
        titleProps={{ variant: "h5" }}
        headerButtons={<SaveRequestButton request={request}/>}
        sx={{
            [`& .${classes.queryParam}`]: {
                display: 'flex',
                justifyContent: 'stretch',
                alignItems: 'center',
            },
            [`& .${classes.queryParam_equals}`]: {
                margin: 1,
                fontSize: '1.5rem',
            },
            [`& .${classes.queryParam_value}`]: {
                width: '50%',
            },

            [`& .${classes.section}`]: {
                marginY: 3,
            },
            [`& .${classes.sectionTitle}`]: {
                borderBottom: 1,
                borderBottomColor: 'divider',
                marginBottom: 1,
                fontWeight: 500,
            },

            [`& .${classes.urlLine}`]: {
                display: 'flex',
                marginTop: 3,
                marginBottom: 2
            }
        }}
    >
        <div className={classes.urlLine}>
            <TextField
                label="Method"
                select
                size="small"
                value={request.method}
                onChange={(ev) => dispatch(DraftActions.setMethod(ev.target.value as Method))}
                sx={{
                    width: '8em',
                    marginRight: 1
                }}
            >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
                <MenuItem value="HEAD">HEAD</MenuItem>
            </TextField>
            <TextField
                label="URL"
                size="small"
                value={request.url}
                onChange={handleChangeUrl}
                sx={{
                    flexGrow: 1,
                    marginRight: 1
                }}
            />
            <Button
                variant="contained"
                endIcon={<SendIcon/>}
            >Send</Button>
        </div>
        <div className={classes.section}>
            <Typography className={classes.sectionTitle} component="h3">Query Parameters</Typography>
            <div>
                {request.queryParameters.map((queryParam, paramIndex) =>
                    <div className={classes.queryParam} key={paramIndex}>
                        <div>
                            <Checkbox
                                checked={queryParam.include}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setQueryParamInclude(paramIndex, ev.target.checked))
                                }
                            />
                        </div>
                        <div className={classes.queryParam_name}>
                            <TextField
                                size="small"
                                label="Name"
                                value={queryParam.name}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setQueryParamName(paramIndex, ev.target.value))
                                }
                            />
                        </div>
                        <div className={classes.queryParam_equals}>=</div>
                        <div className={classes.queryParam_value}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Value"
                                value={queryParam.value}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setQueryParamValue(paramIndex, ev.target.value))
                                }
                            />
                        </div>
                        <IconButton onClick={() => dispatch(DraftActions.deleteQueryParam(paramIndex))}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                )}
            </div>
            <Button onClick={() => dispatch(DraftActions.newQueryParam())}>Add Query Parameter</Button>
        </div>
        <div className={classes.section}>
            <Typography className={classes.sectionTitle} component="h3">Headers</Typography>
            <div>
                {request.headers.map((header, headerIndex) =>
                    <div className={classes.header} key={headerIndex}>
                        <div>
                            <Checkbox
                                checked={header.include}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setHeaderInclude(headerIndex, ev.target.checked))
                                }
                            />
                        </div>
                        <div className={classes.header_name}>
                            <TextField
                                size="small"
                                label="Name"
                                value={header.name}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setHeaderName(headerIndex, ev.target.value))
                                }
                            />
                        </div>
                        <div className={classes.header_equals}>=</div>
                        <div className={classes.header_value}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Value"
                                value={header.value}
                                onChange={(ev) =>
                                    dispatch(DraftActions.setHeaderValue(headerIndex, ev.target.value))
                                }
                            />
                        </div>
                        <IconButton onClick={() => dispatch(DraftActions.deleteHeader(headerIndex))}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                )}
            </div>
            <Button onClick={() => dispatch(DraftActions.newHeader())}>Add Header</Button>
        </div>
        <div className={classes.section}>
            <Typography className={classes.sectionTitle} component="h3">Body</Typography>
            { ['GET', 'DELETE', 'HEAD'].includes(request.method)
                ? <Typography variant="body2">{`Payload not allowed for ${request.method} request.`}</Typography>
                : <></>}
        </div>
    </StyledPaper>
}

export default RequestSheet