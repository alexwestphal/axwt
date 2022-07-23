

import {createTheme, Theme} from '@mui/material/styles'
import {blueGrey} from '@mui/material/colors'


// Augment the MUI Theme
declare module '@mui/material/styles' {

    interface Theme {
        banner: {
            backgroundColor: string,
            textColor: string,
            height: string
        }
    }

    interface Palette {
    }
}

// To keep makeStyles working
import '@mui/styles'

declare module '@mui/styles' {
    interface DefaultTheme extends Theme {}
}

const DefaultTheme = createTheme()

export const createAXWTTheme = () => {

    return createTheme({
        palette: {
            primary: {
                main: blueGrey[700]
            }
        },

        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        zIndex: undefined // Force the appBar to not have a default z-index
                    },
                }
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        "@media": {
                            // To allow tabs to be small enough
                            minWidth: '80px'
                        }
                    }
                }
            },
        }
    }, {
        banner: {
            backgroundColor: blueGrey[700],
            textColor: DefaultTheme.palette.getContrastText(blueGrey[700]),
            height: '48px'
        },
        palette: {

        }
    })
}
