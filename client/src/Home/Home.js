import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import Hero from '../Hero'
import heroImg from '../assets/hero/Scotland1.jpg'

import Newsletter from '../Newsletter'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },

  content: {
    minHeight: '100vh',
    [theme.breakpoints.down('xs')]: {
      // marginBottom: 100
    }
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    fontVariant: 'small-caps',
    height: 130
  },
  title: {
    fontSize: '2rem',
    letterSpacing: 3
  }
}))

const Home = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.content}>
        <Hero
          heroImg={heroImg}
          title={
            <div className={classes.titleSection}>
              <Typography className={classes.title}>SHELBY K COOK</Typography>
            </div>
          }
        />
      </div>
      <Newsletter />
    </>
  )
}

export default Home
