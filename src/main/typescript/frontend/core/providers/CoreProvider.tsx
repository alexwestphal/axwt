
import * as React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

import {ControlBarContext, ControlBarProps} from '../components'
import * as I18n from '../i18n'
import {selectLanguage, useTypedSelector} from '../store'
import {createAXWTTheme} from '../theme'

export const CoreProvider: React.FC = ({children}) => {

    const language = useTypedSelector(selectLanguage)

    // We only want to rebuild the theme when the customization changes
    const theme = React.useMemo(() => createAXWTTheme(), [])

    // Reference to the control bar so that it can be mounted in one place and populated in another
    const [controlBarProps, setControlBarProps] = React.useState<ControlBarProps>({})

    return (
        <I18n.Provider language={language}>
            <StyledEngineProvider injectFirst>
                <ControlBarContext.Provider value={[controlBarProps, setControlBarProps]}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        {children}
                    </ThemeProvider>
                </ControlBarContext.Provider>
            </StyledEngineProvider>
        </I18n.Provider>
    );
}

export default CoreProvider

