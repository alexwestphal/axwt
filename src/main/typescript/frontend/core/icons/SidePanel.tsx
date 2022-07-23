
import * as React from 'react'

import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'

const SidePanelIcon: React.FC<SvgIconProps> = props =>
    <SvgIcon {...props}>
        <path d="M 3.5 2H 21V 22H 3.5V 4H 5.5V 20H 15V 4H 3.5Z"/>
    </SvgIcon>

export default SidePanelIcon