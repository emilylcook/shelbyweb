const theme = {
  typography: {
    fontFamily: ['Raleway']
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
      main: '#70b6c1'
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
}

export default theme
