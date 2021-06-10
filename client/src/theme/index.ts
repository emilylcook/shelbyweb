import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Raleway'
  },
  palette: {
    text: {
      primary: '#414141'
    },
    background: {
      default: '#EDEDED'
    },
    gray: {
      main: '#414141'
    },
    primary: {
      main: '#4f5a4d'
    },
    secondary: {
      main: '#9E9E9E' // intentionally the same as primary
    }
  },
  overrides: {
    MuiButton: {
      root: {
        color: '#fff'
      },
      containedPrimary: {
        color: '#fff'
      }
    }
  }
});

export default theme;
