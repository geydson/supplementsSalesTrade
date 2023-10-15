import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginSuccess: ['token', 'infosUser'],
  setAcessUser: ['acess'],
  changeLanguage: ['language'],
  logoutUser: null,
  setInfosUser: ['infosUser'],
})

export const LoginTypes = Types
export default Creators
