
import * as React from 'react'

import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Typography
} from '@mui/material'

import {createClasses} from '@axwt/util'

import {PlayActions, selectPlayState, useThunkDispatch, useTypedSelector} from '../store'
import {TechniqueKey} from '@axwt/sudoku/technique'


export const assistantPanelClasses = createClasses('AssistantPanel', ["title", "commandSet", "commandSet_label", "commandSet_spacer", "techniqueSet"])

export const AssistantPanel: React.FC = () => {

    const playState = useTypedSelector(selectPlayState)
    const dispatch = useThunkDispatch()

    const classes = assistantPanelClasses
    return <Box
        className={classes.root}
        sx={{
            padding: 1,

            [`& .${classes.title}`]: {
                textAlign: 'center',
                marginY: 2
            },
            [`& .${classes.commandSet}`]: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: 2,

                [`& .${classes.commandSet_label}`]: {
                    flex: '1 0 0',
                    fontWeight: 'bold'
                },

                [`& .${classes.commandSet_spacer}`]: {
                    flex: '1 0 0',
                },

                "& button": {
                    marginLeft: 1,
                }
            },
            [`& .${classes.techniqueSet}`]: {
                margin: 2,
            },

        }}
    >
        <Typography className={classes.title} variant="h4">Sudoku Assistant</Typography>
        <div className={classes.commandSet}>
            <div className={classes.commandSet_label}>Candidates:</div>
            <Button variant="outlined" onClick={() => dispatch(PlayActions.generateCandidates())}>Generate</Button>
            <Button variant="outlined" onClick={() => dispatch(PlayActions.clearCellCandidates())}>Clear</Button>
            <div className={classes.commandSet_spacer}></div>
        </div>
        <div className={classes.commandSet}>
            <div className={classes.commandSet_label}>Search:</div>
            {playState.searchState == 'Ready' && <>
                <Button variant="outlined" onClick={() => dispatch(PlayActions.findNext())}>Find Next</Button>
                <div className={classes.commandSet_spacer}></div>
            </>}
            {playState.searchState == 'Found' && <>
                <div>{playState.searchResult.key}</div>
                <Button variant="outlined" onClick={() => dispatch(PlayActions.applyNext())}>Apply</Button>
                <div className={classes.commandSet_spacer}></div>
            </>}
            {playState.searchState == 'NotFound' && <>
                <div className={classes.commandSet_spacer}>Not Found</div>
            </>}
        </div>
        <Box fontWeight="bold">Techniques:</Box>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TechniqueSet
                    name="Simple"
                    techniques={["NakedSingle", "HiddenSingle"]}
                    active={playState.techniques}
                    onToggleTechnique={(key) => dispatch(PlayActions.toggleTechnique(key))}
                />
            </Grid>
            <Grid item xs={6}>
                <TechniqueSet
                    name="Easy"
                    techniques={["NakedPair", "HiddenPair"]}
                    active={playState.techniques}
                    onToggleTechnique={(key) => dispatch(PlayActions.toggleTechnique(key))}
                />
            </Grid>
        </Grid>
    </Box>
}

export default AssistantPanel

interface TechniqueSetProps {
    name: string
    techniques: TechniqueKey[]
    active: TechniqueKey[]
    onToggleTechnique: (key: TechniqueKey) => void
}

const TechniqueSet: React.FC<TechniqueSetProps> = ({name, techniques, active, onToggleTechnique}) => {

    const classes = assistantPanelClasses
    return <FormControl className={classes.techniqueSet} component="fieldset" variant="standard">
        <FormLabel component="label">{name}</FormLabel>
        <FormGroup>
            {techniques.map(key =>
                <FormControlLabel key={key} label={key} control={
                    <Checkbox checked={active.includes(key)} onChange={() => onToggleTechnique(key)}/>
                }/>
            )}
        </FormGroup>
    </FormControl>
}