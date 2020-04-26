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
      // default: 'white'
    },
    gray: {
      main: '#414141'
    },
    primary: {
      main: '#43657E'
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
