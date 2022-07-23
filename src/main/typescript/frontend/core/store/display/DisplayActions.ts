
import {UUID} from '@axwt/core'

import {Action, createAction} from '../Action'
import * as Core from '../Core'

import {selectDisplay} from './DisplaySelectors'
import {WindowSpec} from './DisplayState'



export namespace DisplayActions {

    type DrawerSide = 'Left' | 'Right'
    export type DrawerClose = Action<'display/drawerClose', null, { side: DrawerSide }>
    export type DrawerOpen = Action<'display/drawerOpen', null, { side: DrawerSide }>

    export type SetFocusBlock = Action<'display/setFocusBlock', UUID, { force: boolean }>

    export type SetTitle = Action<'display/setTitle', string>

    export interface DualWindowOptions {
        primarySide: 'Left' | 'Right'
        secondaryWidth: number
        secondaryWindowUrl?: string | URL,
        onCloseSecondary?: () => void
    }
    export type SetWindowModeDual = Action<'display/setWindowModeDual', DualWindowOptions, { normalSpec: WindowSpec, secondaryWindowId: UUID }>
    export type SetWindowModeNormal = Action<'display/setWindowModeNormal'>

    export type WindowClose = Action<'display/windowClose', Window, { windowId: UUID, detected?: boolean }>
    export type WindowOpen = Action<'display/windowOpen', Window, { windowId: UUID, features: string }>

    export type Any = DrawerClose | DrawerOpen | SetFocusBlock | SetTitle | SetWindowModeDual | SetWindowModeNormal | WindowClose | WindowOpen

    export const closeDrawer = (side: DrawerSide): DrawerClose =>
        createAction('display/drawerClose', null, { side })

    export const openDrawer = (side: DrawerSide): DrawerOpen =>
        createAction('display/drawerOpen', null, { side })

    export const toggleDrawer = (side: DrawerSide): Core.ThunkAction<DrawerOpen | DrawerClose> =>
        (dispatch, getState) => {
            const display = getState().display

            return dispatch(
                side == 'Left'
                    ? display.leftDrawer == 'Open'
                        ? closeDrawer('Left')
                        : openDrawer('Left')
                    : display.rightDrawer == 'Open'
                        ? closeDrawer('Right')
                        : openDrawer('Right')
            )
        }

    export const setFocusBlock = (blockId: UUID, force: boolean = false): SetFocusBlock =>
        createAction('display/setFocusBlock', blockId, {force})

    export const setTitle = (title: string): Core.ThunkAction =>
        (dispatch, getState) => {
            document.title = `AXWT | ${title}`

            dispatch(createAction('display/setTitle', title))
        }

    export const setWindowModeDual = (options: DualWindowOptions): Core.ThunkAction =>
        (dispatch) => {
            let currentSpec: WindowSpec = {
                width: window.innerWidth,
                height: window.innerHeight,
                screenX: window.screenX,
                screenY: window.screenY
            }

            if(options.secondaryWidth > 1) console.warn("Invalid secondaryWidth: "+options.secondaryWidth)
            let secondaryWidth = options.secondaryWidth * currentSpec.width
            let primaryWidth = currentSpec.width - secondaryWidth

            window.resizeTo(primaryWidth, window.outerHeight)


            if(options.primarySide == 'Right') {
                // Need to move the primary window across
                window.moveTo(currentSpec.screenX + secondaryWidth, currentSpec.screenY)
            }

            let secondaryWindowOptions: OpenWindowOptions = {
                width: secondaryWidth,
                height: 'match',
                screenX: options.primarySide == 'Left' ? currentSpec.screenX + primaryWidth : currentSpec.screenX,
                screenY: currentSpec.screenY,
                onClose: () => {
                    if(options.onCloseSecondary) options.onCloseSecondary()
                    dispatch(setWindowModeNormal())

                    // Bring focus back to the primary window
                    window.focus()
                }
            }

            let secondaryWindowId = dispatch(openWindow(options.secondaryWindowUrl || "", secondaryWindowOptions)).meta.windowId

            dispatch(createAction('display/setWindowModeDual', options, { normalSpec: currentSpec, secondaryWindowId }))
        }

    export const setWindowModeNormal = (): Core.ThunkAction =>
        (dispatch, getState) => {
            let { windowSpecNormal: normalSpec, secondaryWindowId } = selectDisplay(getState())

            window.moveTo(normalSpec.screenX, normalSpec.screenY)
            window.resizeTo(normalSpec.width, normalSpec.height)

            dispatch(closeWindow(secondaryWindowId))
            dispatch(createAction('display/setWindowModeNormal'))
        }

    export interface OpenWindowOptions {
        width?: 'match' | number
        height?: 'match' | number
        screenX?: number
        screenY?: number
        noopener?: boolean
        noreferrer?: boolean
        onClose?: () => void
    }

    export const openWindow = (url: string | URL, options?: OpenWindowOptions): Core.ThunkAction<WindowOpen> =>
        (dispatch, getState, { windows}) => {

            let windowId = UUID.create()

            let features = "popup=yes"
            if(options) {
                // Build features
                if(options.width) features += ",width=" + (options.width == 'match' ? window.innerWidth : options.width )
                if(options.height) features += ",height=" + (options.height == 'match' ? window.innerHeight : options.height)
                if(options.screenX) features += ",screenX=" + options.screenX
                if(options.screenY) features += ",screenY=" + options.screenY
                if(options.noopener) features += ",noopener"
                if(options.noreferrer) features += ",noreferrer"
            }

            let newWindow = window.open(url, "_blank", features)
            windows.set(windowId, newWindow)

            // Set up a check for if the window becomes closed
            let intervalId = setInterval(() => {
                if(newWindow.closed) {
                    clearInterval(intervalId)

                    if(windows.has(windowId)) {
                        // We only want to detect closures that are not our own
                        windows.delete(windowId)

                        // Notify the handler if defined
                        if(options.onClose) options.onClose()

                        dispatch(createAction('display/windowClose', newWindow, { windowId, detected: true }))
                    }
                }
            }, 500)


            return dispatch(createAction('display/windowOpen', newWindow, { windowId, features }))
        }

    export const closeWindow = (windowId: UUID): Core.ThunkAction =>
        (dispatch, getState, { windows }) => {

            let windowToClose = windows.get(windowId)
            if(windowToClose) {
                windows.delete(windowId)
                windowToClose.close()
                dispatch(createAction('display/windowClose', windowToClose, { windowId }))
            } else {
                // Probably already been closed
            }
        }

}