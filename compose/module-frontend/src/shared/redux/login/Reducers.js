import { createReducer } from 'reduxsauce'
import { LoginTypes } from './Actions'

export const INITIAL_STATE = {
  token: '',
  acess: [],
  language: null,
}

export const loginSuccess = (state, { token, acess }) => ({
  ...state,
  token,
  acess,
})

export const setAcessUser = (state, { acess }) => ({
  ...state,
  acess,
})

export const changeLanguage = (state, { language }) => ({
  ...state,
  language: language,
})

export const reducer = createReducer(INITIAL_STATE, {
  [LoginTypes.LOGIN_SUCCESS]: loginSuccess,
  [LoginTypes.SET_ACESS_USER]: setAcessUser,
  [LoginTypes.CHANGE_LANGUAGE]: changeLanguage,
})
