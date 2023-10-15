import { createReducer } from 'reduxsauce'
import { LayoutTypes } from './Actions'

export const INITIAL_STATE = {
  sidebarShow: true,
}

export const setSideBarShow = (state, { sidebarShow }) => ({
  ...state,
  sidebarShow,
})

export const setUnfoldable = (state, { unfoldable }) => ({
  ...state,
  unfoldable,
})

export const reducer = createReducer(INITIAL_STATE, {
  [LayoutTypes.SET_SIDE_BAR_SHOW]: setSideBarShow,
  [LayoutTypes.SET_UNFOLDABLE]: setUnfoldable,
})
