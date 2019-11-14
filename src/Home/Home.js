import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Hero from '../Hero'
import heroImg from '../assets/hero/hero_02.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },

  content: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: 100
    }
  }
}))

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.content}>
      <Hero heroImg={heroImg} title="Shelby&nbsp;Art" subText="I like cats, and&nbsp;art." />
    </div>
  )
}

export default Home
