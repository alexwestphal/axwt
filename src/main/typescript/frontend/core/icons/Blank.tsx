
import * as React from 'react'

import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'

const BlankIcon: React.FC<SvgIconProps> = props =>
    <SvgIcon {...props}>
        <path d=""/>
    </SvgIcon>

export default BlankIcon