
import * as React from 'react'
import {Box, Dialog, DialogProps, Grid, GridProps, Paper, Slide, SlideProps, Typography} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'

import {cls} from '@axwt/util'

import {HtmlString} from '../data'




export type SheetProps = React.PropsWithChildren<{
    className?: string
    dialog?: boolean
    DialogProps?: DialogProps
}>

export const Sheet: React.FC<SheetProps> = ({className, children, dialog, DialogProps}) => {

    if(dialog) {
        return <Dialog
            open
            className={cls("Sheet", className)}
            fullWidth maxWidth="md"
            scroll="body"
            PaperProps={{ square: true }}
            TransitionComponent={Slide}
            transitionDuration={750}
            TransitionProps={{ direction: 'up' } as SlideProps}
            {...DialogProps}
        >
            <Grid container>{children}</Grid>
        </Dialog>
    } else {
        return <Paper className={cls("Sheet", className)} square sx={{ marginY: 4 }}>
            <Grid container>{children}</Grid>
        </Paper>
    }
}

export default Sheet


export type ColumnProps = Pick<GridProps, 'alignItems' | 'children' | 'className' | 'justifyContent' | 'sx' | 'width'> & {
    borderTop?: boolean
    borderRight?: boolean
    borderBottom?: boolean
    borderLeft?: boolean
}

export const Column: React.FC<ColumnProps> = ({children, className, borderBottom, borderLeft, borderRight, borderTop, sx = [], ...props}) => {

    return <Grid className={cls("SheetColumn", className)} item container direction="column" sx={[
        {
            borderTop: borderTop && 1,
            borderRight: borderRight && 1,
            borderBottom: borderBottom && 1,
            borderLeft: borderLeft && 1,
            borderColor: 'divider'
        },
        {...props},
        ...(Array.isArray(sx) ? sx : [sx])
    ]}>
        {children}
    </Grid>
}

export type ColumnSpacerProps = Pick<GridProps, 'className' | 'sx' | 'width'> & {
    borderTop?: boolean
    borderRight?: boolean
    borderBottom?: boolean
    borderLeft?: boolean
}

export const ColumnSpacer: React.FC<ColumnSpacerProps> = ({className, borderBottom, borderLeft, borderRight, borderTop, sx = []}) => {

    const spacerRef = React.useRef<HTMLDivElement>()
    const [hide, setHide] = React.useState(false)
    React.useLayoutEffect(() => {
        if(spacerRef.current) {
            setHide(spacerRef.current.clientHeight == 0)
        }
    })

    return <Grid className={cls("SheetColumnSpacer", className)} ref={spacerRef} item container direction="column" sx={[
        {
            borderTop: borderTop && !hide && 1,
            borderRight: borderRight && 1,
            borderBottom: borderBottom && !hide && 1,
            borderLeft: borderLeft && 1,
            borderColor: 'divider',

            flex: '1 0 0',
        },
        ...(Array.isArray(sx) ? sx : [sx])
    ]}/>
}


export type CellProps = Pick<GridProps, 'alignItems' | 'children' | 'className' | 'flex' | 'justifyContent' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingX' | 'paddingY' | 'sx' | 'width'> & {

    borderTop?: boolean
    borderRight?: boolean
    borderBottom?: boolean
    borderLeft?: boolean

    title?: string
    TitleIcon?: React.ComponentType<SvgIconProps>
}

export const Cell: React.FC<CellProps> = ({children, className, borderBottom, borderLeft, borderRight, borderTop, sx = [], title, TitleIcon, ...props}) => {

    return <Grid className={cls("SheetCell", className)} item sx={[
        {
            position: 'relative',
            display: 'flex',

            paddingTop: title ? 3 : 2,
            paddingRight: 2,
            paddingBottom: 2,
            paddingLeft: 2,

            borderTop: borderTop && 1,
            borderRight: borderRight && 1,
            borderBottom: borderBottom && 1,
            borderLeft: borderLeft && 1,
            borderColor: 'divider'
        },
        { ...props },
        ...(Array.isArray(sx) ? sx : [sx])
    ]}>
        { (title || TitleIcon) && <Typography component="h3" sx={ theme => ({
            position: 'absolute',
            left: theme.spacing(1),
            top: theme.spacing(0.5),
            color: 'text.secondary',
            fontSize: 'default',

            display: 'flex',
            alignItems: 'center'
        })}>
            {TitleIcon && <TitleIcon sx={{fontSize: 'inherit', color: 'inherit', marginRight: .5, paddingBottom: '1px'}}/>}{title}
        </Typography> }
        {children}
    </Grid>
}


export type TitleCellProps = CellProps & {
    name: string | HtmlString
    thumbnailUrl?: string
}

export const TitleCell: React.FC<TitleCellProps> = ({name, thumbnailUrl, ...props}) => {

    return <Cell justifyContent="center" sx={{
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,

        justifyContent: 'flex-start',
        alignItems: 'center'

    }} {...props}>
        {thumbnailUrl && <Box padding={1}><img width={100} height={75} src={thumbnailUrl}/></Box>}
        {typeof name === 'string'
            ? <Typography variant="h4" component="h2" padding={2}>{name}</Typography>
            : <Typography variant="h4" component="h2" padding={2} dangerouslySetInnerHTML={name}/>
        }

    </Cell>
}