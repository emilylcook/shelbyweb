import { persistCombineReducers } from 'redux-persist'
import persistStorage from 'redux-persist/lib/storage'
import { connectRouter } from 'connected-react-router'

//import reducers here
const persistConfig = {
  key: process.env.REACT_APP_NAME,
  whitelist: [
    // reducers in this array will be cached in localstorage
  ],
  storage: persistStorage
}

export default history =>
  persistCombineReducers(persistConfig, {
    router: connectRouter(history)
  })
