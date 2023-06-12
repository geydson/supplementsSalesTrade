import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginSuccess: ['token', 'acess'],
  setAcessUser: ['acess'],
  changeLanguage: ['language'],
  login: null,
})

export const LoginTypes = Types
export default Creators
