
import * as React from 'react'

import {Paper, PaperProps, Typography, TypographyProps} from '@mui/material'
import {cls, createClasses} from '@axwt/util'

export type StyledPaperProps = PaperProps & {
    focus?: boolean
    highlight?: boolean
    tight?: boolean

    title?: string
    titleProps?: TypographyProps<'h2'>

    headerButtons?: React.ReactNode
}

export const styledPaperClasses = createClasses("StyledPaper", ["focus", "header", "headerButtons", "highlight", "title", "tight"])

export const StyledPaper = React.forwardRef<HTMLDivElement, StyledPaperProps>(({children, className, focus, headerButtons, highlight, sx = [], tight, title, titleProps, ...props}, forwardedRef) => {
    return <Paper
        className={cls(styledPaperClasses.root, className, {
            [styledPaperClasses.focus]: focus,
            [styledPaperClasses.highlight]: highlight,
            [styledPaperClasses.tight]: tight
        })}
        ref={forwardedRef}
        sx={[
            {
                marginY: 2,
                padding: 2,

                [`&.${styledPaperClasses.focus}`]: theme => ({
                    borderLeft: theme.spacing(.5),
                    borderLeftStyle: 'solid',
                    borderLeftColor: 'primary.main',
                    paddingLeft: 1.5
                }),
                [`&.${styledPaperClasses.highlight}`]: theme => ({
                    borderTop: theme.spacing(1),
                    borderTopStyle: 'solid',
                    borderTopColor: 'primary.main'
                }),
                [`&.${styledPaperClasses.tight}`]: {
                    padding: 0
                },

                [`& .${styledPaperClasses.header}`]: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 1
                }
            },
            ...(Array.isArray(sx) ? sx : [sx])
        ]}
        {...props}
    >
        { (title || headerButtons) && <div className={styledPaperClasses.header}>
            <Typography className={styledPaperClasses.title} component="h2" variant="h6" color="primary" {...titleProps}>{title}</Typography>
            <div className={styledPaperClasses.headerButtons}>{headerButtons}</div>
        </div>}

        {children}
    </Paper>
})

export default StyledPaper