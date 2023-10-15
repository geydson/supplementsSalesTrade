import { combineReducers } from 'redux'
import configureStore from './createStore'
import rootSaga from './rootSaga'

import { reducer as LoginReducer } from './login/Reducers'
import { reducer as LayoutReducer } from './layout/Reducers'

export const createStore = () => {
  const rootReducer = combineReducers({
    login: LoginReducer,
    layout: LayoutReducer,
  })

  return configureStore(rootReducer, rootSaga)
}

export const { store, persistor } = createStore()
