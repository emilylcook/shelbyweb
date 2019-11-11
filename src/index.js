import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import config from './config'

import configureStore, { history } from './store'
import Root from './Root'

const { store, persistor } = configureStore()

ReactDOM.render(
  <Root store={store} persistor={persistor} history={history} />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

console.log(`Build version: ${config.VERSION}`)
