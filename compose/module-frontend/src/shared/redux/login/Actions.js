import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginSuccess: ['token', 'infosUser'],
  setAcessUser: ['acess'],
  changeLanguage: ['language'],
})

export const LoginTypes = Types
export default Creators
