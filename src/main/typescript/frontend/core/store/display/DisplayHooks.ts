
import {UUID} from '@axwt/core/data'

import {useThunkDispatch, useTypedSelector} from '../Core'

import {DisplayActions} from './DisplayActions'


export const useHasFocus = (blockId: UUID): [boolean, boolean, () => void] => {
    const display = useTypedSelector(state => state.display)
    const dispatch = useThunkDispatch()
    const hasFocus = display.focusBlockId == blockId
    const takeFocus = () => dispatch(DisplayActions.setFocusBlock(blockId))
    return [hasFocus, display.forceFocus, takeFocus]
}