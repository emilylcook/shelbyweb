import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { configureStore as starterKitConfig } from 'redux-starter-kit'

import createRootReducer from './reducers'

const base = process.env.REACT_APP_BASE_PATH || '/'

const history = createBrowserHistory({
  basename: document.location.pathname.includes(base) ? base : '/'
})

function configureStore() {
  const reactRouterMiddleware = routerMiddleware(history)
  let middlewares = [thunk, reactRouterMiddleware]

  if (process.env.NODE_ENV !== 'production') {
    middlewares = [
      ...middlewares
      //add dev-only middlewares here
    ]
  }

  const store = starterKitConfig({
    reducer: createRootReducer(history),
    middleware: middlewares,
    devtools: process.env.NODE_ENV !== 'production'
  })

  return {
    store,
    persistor: persistStore(store)
  }
}

export default configureStore
export { history }
