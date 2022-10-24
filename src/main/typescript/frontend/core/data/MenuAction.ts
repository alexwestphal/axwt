/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {SvgIconProps} from '@mui/material/SvgIcon'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentCutIcon from '@mui/icons-material/ContentCut'

import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'

import {KeyboardShortcut, StandardShortcuts} from './KeyboardShortcut'


export interface MenuAction {
    actionId: string
    label: string
    icon: React.ComponentType<SvgIconProps>
    keyboardShortcut?: KeyboardShortcut
}

export namespace MenuAction {

    export const create = (actionId: string, label: string, icon: React.ComponentType<SvgIconProps>, keyboardShortcut?: KeyboardShortcut): MenuAction => {
        return {actionId, label, icon, keyboardShortcut}
    }
}

export namespace StandardMenuActions {

    export const ActionRedo = MenuAction.create('actionRedo', 'Redo', RedoIcon, StandardShortcuts.ActionRedo)
    export const ActionUndo = MenuAction.create('action.undo', 'Undo', UndoIcon, StandardShortcuts.ActionUndo)
    export const ContentCopy = MenuAction.create('contentCopy', 'Copy', ContentCopyIcon, StandardShortcuts.ContentCopy)
    export const ContentCut = MenuAction.create('contentCut', 'Cut', ContentCutIcon, StandardShortcuts.ContentCut)
    export const ContentPaste = MenuAction.create('contentPaste', 'Paste', ContentPasteIcon, StandardShortcuts.ContentPaste)
    export const FileOpen = MenuAction.create('fileOpen', 'Open', FileOpenIcon, StandardShortcuts.FileOpen)
    export const FileSave = MenuAction.create('fileSave', 'Save', SaveIcon, StandardShortcuts.FileSave)
    export const FileSaveAs = MenuAction.create('fileSaveAs', 'Save As', SaveAsIcon, StandardShortcuts.FileSaveAs)
    export const FolderOpen = MenuAction.create('folderOpen', 'Open Folder', FolderOpenIcon)
}
