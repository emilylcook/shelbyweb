import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'

import themeConfig from './theme'
import App from './App'
const theme = createMuiTheme(themeConfig)

const useStyles = makeStyles(() => ({
  success: { backgroundColor: '#407982' },
  error: { backgroundColor: 'blue' },
  warning: { backgroundColor: 'green' },
  info: { backgroundColor: 'yellow' }
}))

export default function Root({ store, history, persistor }) {
  const classes = useStyles()

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <ConnectedRouter history={history}>
            <SnackbarProvider
              classes={{
                variantSuccess: classes.success,
                variantError: classes.error,
                variantWarning: classes.warning,
                variantInfo: classes.info
              }}
              maxSnack={1}
            >
              <App />
            </SnackbarProvider>
          </ConnectedRouter>
        </PersistGate>
      </MuiThemeProvider>
    </Provider>
  )
}
