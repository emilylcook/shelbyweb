import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import '@fortawesome/fontawesome-free/css/all.css'

import Home from './Home'
import Footer from './Footer'
import Header from './Header'
import { useScrollRestoration } from './utils'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    zIndex: 10
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  container: {
    //padding: '15px 15px 60px 15px',
    top: 100,
    position: 'relative',
    width: '100%',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      top: -10
    }
  }
}))

const App = () => {
  useScrollRestoration()
  const classes = useStyles()

  return (
    <div>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <main className={classes.container}>
          {/* main component to render */}

          {/* <NavSpacer /> */}

          <Switch>
            <Route path="/" exact component={Home} />
            <Redirect to="/" />
          </Switch>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
