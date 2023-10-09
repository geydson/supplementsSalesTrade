import { put } from 'redux-saga/effects'
import LoginActions from './Actions'

export function* login({ token, infosUser }) {
  try {
    console.log(token, infosUser)
    yield put(LoginActions.loginSuccess(token, infosUser))
  } catch (error) {
    console.log(error)
  }
}
