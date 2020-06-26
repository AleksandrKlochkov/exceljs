import { storage } from '@core/utils'
import { defaultStyles, defaultTitle } from '../constants'

export const defaultState = {
    title: defaultTitle,
    rowState: {},
    colState: {},
    dataState: {},
    stylesState: {},
    currentText: '',
    currentStyles: defaultStyles
}

const normalise = state => ({
    ...state,
    currentStyles: defaultStyles,
    currentText: '',
})

export const initialState = storage('excel-state') ?
                            normalise(storage('excel-state')) :
                            defaultState
