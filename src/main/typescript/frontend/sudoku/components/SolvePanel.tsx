
import * as React from 'react'

import {
    Box,
    Button,
    buttonClasses,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField, Tooltip,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ConstructionIcon from '@mui/icons-material/Construction'
import PlayIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import PreviewIcon from '@mui/icons-material/Preview'
import ResetIcon from '@mui/icons-material/RestartAlt'

import {createClasses} from '@axwt/util'

import {SolveDirection, SolveStrategy} from '../data'
import {selectSolveState, SolveActions, useThunkDispatch, useTypedSelector} from '../store'


export const solverPanelClasses = createClasses("SolverPanel", ["buttons", "title", "result", "resultTitle", "resultValues", "resultValue", "resultValue_label", "resultValue_value"])

export const SolvePanel: React.FC = () => {

    const solveState = useTypedSelector(selectSolveState)
    const dispatch = useThunkDispatch()

    const classes = solverPanelClasses
    return <Box
        className={classes.root}
        sx={{
            padding: 1,

            [`& .${classes.buttons}`]: {
                display: 'flex',
                justifyContent: 'center',
                marginY: 1,

                [`& > .${buttonClasses.root}`]: {
                    marginX: 1
                }
            },
            [`& .${classes.title}`]: {
                textAlign: 'center',
                marginY: 2
            },
            [`& .${classes.result}`]: {
                marginY: 2
            },
            [`& .${classes.resultTitle}`]: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25em',
                fontWeight: 'bold',
                borderBottom: 1,
                marginBottom: 1,
            },
            [`& .${classes.resultValue}`]: {
                marginLeft: 1,
            },
            [`& .${classes.resultValue_label}`]: {
                display: 'inline-block',
                width: '10em',
                textAlign: 'right',
                fontWeight: 'bold',
                marginRight: 1,
            },
        }}
    >
        <Typography className={classes.title} variant="h4">Sudoku Solver</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    label="Strategy"
                    size="small"
                    select
                    fullWidth
                    value={solveState.strategy}
                    onChange={ev => dispatch(SolveActions.setStrategy(ev.target.value as SolveStrategy))}
                >
                    <MenuItem value="brute-force">Brute Force</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Step Limit"
                    size="small"
                    fullWidth
                    type="number"
                    value={solveState.stepLimit}
                    onChange={ev => dispatch(SolveActions.setStepLimit(parseInt(ev.target.value)))}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Playback Speed"
                    size="small"
                    fullWidth
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">steps/s</InputAdornment>
                    }}
                    inputProps={{
                        min: 1
                    }}
                    value={solveState.playbackSpeed}
                    onChange={ev => dispatch(SolveActions.setPlaybackSpeed(parseInt(ev.target.value)))}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Solve Direction"
                    size="small"
                    select
                    fullWidth
                    value={solveState.solveDirection}
                    onChange={ev => dispatch(SolveActions.setDirection(ev.target.value as SolveDirection))}
                >
                    <MenuItem value="Forward">Forward</MenuItem>
                    <MenuItem value="Reverse">Reverse</MenuItem>
                    <MenuItem value="Spiral">Spiral</MenuItem>
                </TextField>
            </Grid>
        </Grid>


        {solveState.result == null
            ? <div className={classes.buttons}>
                <Button
                    variant="contained"
                    endIcon={<ConstructionIcon/>}
                    onClick={() => dispatch(SolveActions.createSolution())}
                >Solve</Button>
            </div>
            : <>
                <div className={classes.result}>
                    <div className={classes.resultTitle}>
                        Result
                        <Tooltip title="Clear Result">
                            <IconButton onClick={() => dispatch(SolveActions.clearSolution())}>
                                <CloseIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={classes.resultValues}>
                        <div className={classes.resultValue}>
                            <span className={classes.resultValue_label}>Status:</span>
                            <span className={classes.resultValue_value}>{solveState.result.success ? "Success" : "Failed"}</span>
                        </div>
                        <div className={classes.resultValue}>
                            <span className={classes.resultValue_label}>Time Taken:</span>
                            <span className={classes.resultValue_value}>{solveState.result.timeTaken}ms</span>
                        </div>
                        <div className={classes.resultValue}>
                            <span className={classes.resultValue_label}>Steps:</span>
                            <span className={classes.resultValue_value}>{solveState.result.stepCount}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.buttons}>
                    {solveState.playback != 'Show' && <Button
                        variant="contained"
                        endIcon={<PreviewIcon/>}
                        onClick={() => dispatch(SolveActions.showResult())}
                    >Show</Button>}

                    {solveState.playback == 'Reset' && <Button
                        variant="contained"
                        endIcon={<PlayIcon/>}
                        onClick={() => dispatch(SolveActions.play())}
                    >Play</Button>}
                    {solveState.playback == 'Play' && <Button
                        variant="contained"
                        endIcon={<PauseIcon/>}
                        onClick={() => dispatch(SolveActions.pause())}
                    >Pause</Button>}
                    {solveState.playback == 'Pause' && <Button
                        variant="contained"
                        endIcon={<PlayIcon/>}
                        onClick={() => dispatch(SolveActions.play())}
                    >Resume</Button>}

                    {solveState.playback != 'Reset' && <Button
                        variant="contained"
                        endIcon={<ResetIcon/>}
                        onClick={() => dispatch(SolveActions.reset())}
                    >Reset</Button>}
                </div>
            </>
        }

    </Box>
}

export default SolvePanel