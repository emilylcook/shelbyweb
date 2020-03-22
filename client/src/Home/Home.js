import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Hero from '../Hero'
import heroImg from '../assets/hero/hero_02.jpg'
import nameImg from '../assets/name.png'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },
  image: {
    height: 'auto',
    width: '250px',
    [theme.breakpoints.down('xs')]: {
      // marginBottom: 100
    }
  },
  content: {
    [theme.breakpoints.down('xs')]: {
      // marginBottom: 100
    }
  }
}))

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.content}>
      <Hero
        heroImg={heroImg}
        title={<img alt="shelby cook" src={nameImg} className={classes.image} />}
      />
    </div>
  )
}

export default Home
