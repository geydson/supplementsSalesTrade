// import { applyMiddleware, compose, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  /**
   * Blacklist state that we do not need/want to persist
   */
  // blacklist: ["profile"],
}

const CreateStore = (rootReducer, rootSaga) => {
  const middleware = []
  const enhancers = []
  const sagaMiddleware = createSagaMiddleware()

  // Connect the sagas to the redux store
  middleware.push(sagaMiddleware)

  // enhancers.push(applyMiddleware(...middleware))

  // Redux persist
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  // const store = createStore(persistedReducer, compose(...enhancers))
  const store = configureStore({
    reducer: persistedReducer,
    middleware,
    enhancers,
  })
  const persistor = persistStore(store)

  // Kick off the root saga
  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}

export default CreateStore
