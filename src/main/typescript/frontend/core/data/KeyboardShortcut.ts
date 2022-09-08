
/*
 * Copyright (c) 2022, Alex Westphal.
 */


export interface KeyboardShortcut {
    shortcutId: string
    name: string
    key: string
    modifiers: KeyboardShortcut.Modifier[]
}

export namespace KeyboardShortcut {
    const isMacLike = navigator.platform.toUpperCase().indexOf("MAC") >= 0

    export const ModifierSymbols: { [modifier in Modifier]: string } = {
        Alt: '⌥',
        Control: '⌃',
        Meta: '⌘',
        Shift: '⇧'
    }

    export type Modifier = 'Alt' | 'Control' | 'Meta' | 'Shift'

    export const PlatformModifier = isMacLike ? 'Meta' : 'Control'


    export const shortcutString = (ks: KeyboardShortcut): string => {
        if(ks === undefined) return ""

        let result = ''
        for(let modifier of ks.modifiers) {
            result += ModifierSymbols[modifier]
        }
        return result += ks.key
    }


    export const create = (shortcutId: string, name: string, key: string, modifiers: Modifier[]): KeyboardShortcut => {
        return { shortcutId, name, key, modifiers }
    }
}

export namespace StandardShortcuts {
    export const ActionRedo = KeyboardShortcut.create('actionRedo', 'Redo', 'Z', [KeyboardShortcut.PlatformModifier, 'Shift'])
    export const ActionUndo = KeyboardShortcut.create('actionUndo', 'Undo', 'Z', [KeyboardShortcut.PlatformModifier])
    export const ContentCopy = KeyboardShortcut.create('contentCopy', 'Copy', 'C', [KeyboardShortcut.PlatformModifier])
    export const ContentCut = KeyboardShortcut.create('contentCut', 'Cut', 'X', [KeyboardShortcut.PlatformModifier])
    export const ContentPaste = KeyboardShortcut.create('contentPaste', 'Paste', 'P', [KeyboardShortcut.PlatformModifier])
    export const FileOpen = KeyboardShortcut.create('fileOpen', 'Open', 'O', [KeyboardShortcut.PlatformModifier])
    export const FileSave = KeyboardShortcut.create('fileSave', 'Save', 'S', [KeyboardShortcut.PlatformModifier])
    export const FileSaveAs = KeyboardShortcut.create('fileSaveAs', 'Save As', 'S', [KeyboardShortcut.PlatformModifier, 'Shift'])
}

export type KeyboardModifierMap = {
    Alt?: KeyboardShortcut
    AltControl?: KeyboardShortcut
    AltMeta?: KeyboardShortcut
    AltShift?: KeyboardShortcut
    Control?: KeyboardShortcut
    ControlMeta?: KeyboardShortcut
    ControlShift?: KeyboardShortcut
    Meta?: KeyboardShortcut
    MetaShift?: KeyboardShortcut
}

export type KeyboardShortcutMap = { [key: string]: KeyboardModifierMap }

export namespace KeyboardShortcutMap {
    export const create = (shortcuts: KeyboardShortcut[] = []): KeyboardShortcutMap => {
        let result: KeyboardShortcutMap = {}
        for(let shortcut of shortcuts) {
            let key = shortcut.key.toLowerCase()
            let modifiers = shortcut.modifiers
            let modifierMap: KeyboardModifierMap = result[key] ?? {}

            let modifierComboKey: keyof KeyboardModifierMap
            if(modifiers.includes('Alt')) {
                if(modifiers.includes('Control')) modifierComboKey = 'AltControl'
                else if(modifiers.includes('Meta')) modifierComboKey = 'AltMeta'
                else if(modifiers.includes('Shift')) modifierComboKey = 'AltShift'
                else modifierComboKey = 'Alt'
            } else if(modifiers.includes('Control')) {
                if(modifiers.includes('Meta')) modifierComboKey = 'ControlMeta'
                else if(modifiers.includes('Shift')) modifierComboKey = 'ControlShift'
                else modifierComboKey = 'Control'
            } else if(modifiers.includes('Meta')) {
                if (modifiers.includes('Shift')) modifierComboKey = 'MetaShift'
                else modifierComboKey = 'Meta'
            }

            if(modifierComboKey) {
                modifierMap[modifierComboKey] = shortcut
                result[key] = modifierMap
            }
        }
        return result
    }
}