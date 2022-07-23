
import * as React from 'react'

import SvgIcon, {SvgIconProps} from '@mui/material/SvgIcon'

const DragHandleVerticalIcon: React.FC<SvgIconProps> = props =>
    <SvgIcon {...props}>
        {/*<path d="M 9 20V 4h2v16H9z M 15 4v16h-2v4h2z"></path>*/}
        <path d="M 8.5 4v 16h2v-16z M 13.5 4v16h2v-16z"></path>
    </SvgIcon>

export default DragHandleVerticalIcon