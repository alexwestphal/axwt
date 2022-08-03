/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Autocomplete,
    Box,
    ClickAwayListener,
    Grid, IconButton,
    InputAdornment, outlinedInputClasses,
    Paper,
    Popper,
    Slider,
    sliderClasses,
    TextField, Tooltip,
} from '@mui/material'
import {blueGrey} from '@mui/material/colors'
import PaletteIcon from '@mui/icons-material/Palette'

import {cls, createClasses, createIDs} from '@axwt/util'

import {Color} from '../../data'


export interface ColorFieldProps {
    label: string
    value: string
    onChange: (newValue: string) => void
}

const colorFieldClasses = createClasses("ColorField", ["input", "inputHighlighted"])

export const ColorField: React.FC<ColorFieldProps> = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

    const handleOpen = (ev: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(ev.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const classes = colorFieldClasses
    return <Box
        className={classes.root}
        sx={{

            [`& .${classes.inputHighlighted}`]: {
                backgroundColor: blueGrey[50]
            },

        }}
    >
        <TextField
            className={cls(classes.input, { [classes.inputHighlighted]: Boolean(anchorEl) })}
            variant="standard"
            fullWidth
            label={props.label}
            value={props.value}
            autoComplete="off"
            InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ color: 'unset', paddingRight: 1 }}>
                    <Tooltip title="Open Color Selector">
                        <IconButton onClick={handleOpen}>
                            <PaletteIcon/>
                        </IconButton>
                    </Tooltip>
                </InputAdornment>
            }}
        />
        <ColorSelector
            anchorEl={anchorEl}
            value={props.value}
            onChange={props.onChange}
            onClose={handleClose}
        />
    </Box>
}

export default ColorField



export interface ColorSelectorProps {
    anchorEl: HTMLElement
    value: string
    onClose: () => void
    onChange: (newValue: string) => void
}

export const colorSelectorClasses = createClasses("ColorSelector", ["hexInput", "numberInput", "output", "preview", "sliderLabel", "sliderContainer"])

export const ColorSelector: React.FC<ColorSelectorProps> = ({anchorEl, value, onClose, onChange}) => {

    const [color, setColor] = React.useState<Color>(Color.Default)
    const [hexValue, setHexValue] = React.useState<string | null>(null)
    const [valid, setValid] = React.useState<boolean>(false)

    React.useEffect(() => {
        let parsedColor = Color.parseColor(value)
        if(parsedColor == null) {
            setColor(Color.Default)
            setHexValue("")
            setValid(false)
        } else {
            setColor(parsedColor)
            setHexValue(null)
            setValid(true)
        }
    }, [value])

    const handleChangeHex = (event: React.ChangeEvent<HTMLInputElement>) => {
        let str = event.target.value

        if(str == '') {
            setHexValue(null)
            setValid(false)
        } else {
            if(str.startsWith("#")) str = str.substring(1)
            str = str.replaceAll(/[^\dA-F]/gi, '')
            if(str.length > 6) str = str.substring(0, 6)

            str = '#' + str
            setHexValue(str)

            if(str.length == 7) {
                let newColor = Color.parseColor(str)
                setColor({...newColor, alpha: color.alpha })
                setHexValue(null)
                setValid(true)
            }
        }
    }
    const handleChange = (channel: keyof Color, newValue: number) => {
        setColor({...color, [channel]: newValue})
        setHexValue(null)
        setValid(true)
    }


    const handleClose = () => {
        let str = valid ? Color.toString(color) : ""
        if(str != value) onChange(str)

        onClose()
    }

    const classes = colorSelectorClasses
    const IDs = createIDs("ColorSelector", ["redSliderLabel", "greenSliderLabel", "blueSliderLabel", "alphaSliderLabel"])
    return anchorEl && <ClickAwayListener onClickAway={handleClose}>
        <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="bottom-end"
            sx={{ zIndex: 1000 }}
        >
            <Paper
                elevation={0}

                sx={{
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    marginTop: 1.5,
                    padding: 1,
                    width: 320,

                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        backgroundColor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },


                    [`& .${classes.preview}`]: theme => ({
                        flex: 'none',
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: Color.toString(color),
                        boxShadow: theme.shadows[1],
                        margin: 'auto',
                        content: "''",
                    }),


                    [`& .${classes.sliderLabel}`]: {
                        display: 'block',
                        width: '100%',
                        textAlign: 'right',
                    },

                    [`& .${classes.sliderContainer}`]: {
                        display: 'flex',
                        alignItems: 'stretch',
                        paddingX: 1,
                    },

                    [`& .${classes.numberInput}`]: {
                        [`& .${outlinedInputClasses.input}`]: {
                            padding: "8.5px 4px",
                        },
                    },
                    [`& .${classes.hexInput}`]: {

                    },

                    [`& .${sliderClasses.thumb}`]: {
                        width: 8,
                        borderRadius: 2
                    },

                }}
            >
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>
                        <div className={classes.preview}></div>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            className={classes.hexInput}
                            label="RGB Hex"
                            size="small"
                            autoFocus
                            placeholder="none"
                            value={hexValue ?? Color.toHex(color)}
                            onChange={handleChangeHex}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <label className={classes.sliderLabel} id={IDs.redSliderLabel}>Red</label>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.sliderContainer}>
                            <Slider
                                min={0}
                                max={255}
                                aria-labelledby={IDs.redSliderLabel}
                                value={color.red}
                                onChange={(ev, newValue: number) => handleChange('red', newValue)}
                                sx={{
                                    [`& .${sliderClasses.rail}, .${sliderClasses.track}`]: { backgroundColor: 'red', borderColor: 'red' }
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.numberInput}
                            size="small" fullWidth
                            inputProps={{
                                type: 'number',
                                min: 0,
                                max: 255,
                                step: 1,
                                'aria-labelledby': IDs.redSliderLabel
                            }}
                            value={color.red}
                            onChange={(ev) => handleChange('red', parseInt(ev.target.value))}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <label className={classes.sliderLabel} id={IDs.greenSliderLabel}>Green</label>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.sliderContainer}>
                            <Slider
                                min={0}
                                max={255}
                                aria-labelledby={IDs.greenSliderLabel}
                                value={color.green}
                                onChange={(ev, newValue: number) => handleChange('green', newValue)}
                                sx={{
                                    [`& .${sliderClasses.rail}, .${sliderClasses.track}`]: { backgroundColor: 'green', borderColor: 'green' }
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.numberInput}
                            size="small" fullWidth
                            inputProps={{
                                type: 'number',
                                min: 0,
                                max: 255,
                                step: 1,
                                'aria-labelledby': IDs.greenSliderLabel
                            }}
                            value={color.green}
                            onChange={(ev) => handleChange('green', parseInt(ev.target.value))}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <label className={classes.sliderLabel} id={IDs.blueSliderLabel}>Blue</label>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.sliderContainer}>
                            <Slider
                                min={0}
                                max={255}
                                aria-labelledby={IDs.blueSliderLabel}
                                value={color.blue}
                                onChange={(ev, newValue: number) => handleChange('blue', newValue)}
                                sx={{
                                    [`& .${sliderClasses.rail}, .${sliderClasses.track}`]: { backgroundColor: 'blue', borderColor: 'blue' }
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.numberInput}
                            size="small" fullWidth
                            inputProps={{
                                type: 'number',
                                min: 0,
                                max: 255,
                                step: 1,
                                'aria-labelledby': IDs.blueSliderLabel
                            }}
                            value={color.blue}
                            onChange={(ev) => handleChange('blue', parseInt(ev.target.value))}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <label className={classes.sliderLabel} id={IDs.alphaSliderLabel}>Alpha</label>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.sliderContainer}>
                            <Slider
                                min={0}
                                max={100}
                                aria-labelledby={IDs.alphaSliderLabel}
                                value={Math.round(color.alpha * 100)}
                                onChange={(ev, newValue: number) => handleChange('alpha', newValue/100)}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.numberInput}
                            size="small" fullWidth
                            inputProps={{
                                type: 'number',
                                min: 0,
                                max: 100,
                                step: 1,
                                'aria-labelledby': IDs.alphaSliderLabel
                            }}
                            value={Math.round(color.alpha * 100)}
                            onChange={(ev) => handleChange('alpha', parseInt(ev.target.value)/100)}
                        />
                    </Grid>
                </Grid>

            </Paper>
        </Popper>
    </ClickAwayListener>
}
