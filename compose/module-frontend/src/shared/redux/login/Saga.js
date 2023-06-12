import { put } from 'redux-saga/effects'
import LoginActions from './Actions'

export function* login({ token, acess }) {
  try {
    yield put(LoginActions.layoutSuccess(token, acess))
  } catch (error) {
    console.log(error)
  }
}
