import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import '@fortawesome/fontawesome-free/css/all.css'

import Home from './Home/'
// import Connect from './Connect'
import About from './About'
import Footer from './Footer'
import Artwork from './Artwork/'
import Header from './Header'
import Commissions from './Commissions'
import { useScrollRestoration } from './utils'

import getCollection from './Artwork/collections'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    zIndex: 10
    // backgroundColor: '#e8e8e8'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  container: {
    //padding: '15px 15px 60px 15px',
    top: 64,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      top: 54
    }
  },
  body: {
    minHeight: 'calc(100vh - 50px)'
  },
  hidden: {
    display: 'none'
  }
}))

const PreloadImages = classes => {
  let allArt = getCollection('all').collection
  return (
    <div id="preload" className={classes.hidden} style={{ display: 'none' }}>
      {Object.entries(allArt).map(([key, { path, name, info }]) => (
        <img
          key={key}
          className={classes.hidden}
          style={{ display: 'none' }}
          alt={name}
          src={path}
        />
      ))}
    </div>
  )
}

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

          <div className={classes.body}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/about" exact component={About} />
              {/* <Route path="/connect" exact component={Connect} /> */}
              <Route path="/commissions" exact component={Commissions} />
              <Route path="/artwork/:collection" component={Artwork} />
              <Redirect to="/" />
            </Switch>
          </div>
          <PreloadImages classes={classes} />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
