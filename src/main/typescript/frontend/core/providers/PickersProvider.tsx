
import * as React from 'react'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'

export const PickersProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) =>
    <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>

export default PickersProvider


