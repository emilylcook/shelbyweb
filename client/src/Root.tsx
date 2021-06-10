import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { CookiesProvider } from 'react-cookie';

import useCollectionData from './utils/useCollectionData';
import theme from './theme/';
import App from './App';
import { AuthProvider } from './utils/useAuth';

const useStyles = makeStyles(() => ({
  success: { backgroundColor: '#4f5a4d' },
  error: { backgroundColor: '#975151' },
  warning: { backgroundColor: 'green' },
  info: { backgroundColor: 'yellow' }
}));

export default function Root({ store, history, persistor }: any) {
  const classes = useStyles();

  // Initialize Collections
  useCollectionData();

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
              <CookiesProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </CookiesProvider>
            </SnackbarProvider>
          </ConnectedRouter>
        </PersistGate>
      </MuiThemeProvider>
    </Provider>
  );
}
