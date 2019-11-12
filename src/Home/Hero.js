import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import WidthContainer from '../WidthContainer'

import HeroImg from '../assets/hero/hero_02.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    // height: 'calc(100vh - 64px)',
    height: 700,
    maxHeight: '80%',
    width: 'calc(100vw)',
    filter: 'grayscale(74%)',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    background: `url(${HeroImg}) center center no-repeat rgb(217, 217, 217)`,
    display: 'flex',
    backgroundSize: 'cover',
    flexDirection: 'column'
  },
  heroOverlay: {
    backgroundColor: 'rgba(255, 255, 255, .9)',
    color: 'black',
    textAlign: 'left',
    padding: 35,
    position: 'sticky',
    // [theme.breakpoints.down('xs')]: {
    //   padding: 25
    // },
    '&:after': {
      zIndex: -1,
      position: 'absolute',
      top: -10,
      left: -10,
      width: 'calc(100% + 20px)',
      height: 'calc(100% + 20px)',
      border: '1px solid rgba(255, 255, 255, .96)',
      content: "''"
    }
  },
  heroTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '3.0rem'
    }
  },
  subTitle: {
    marginBottom: '15px'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
}))

function Hero() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <WidthContainer fullWidth={true} className={classes.columnWrapper}>
        <Grid container spacing={0} className={classes.container}>
          <Grid item md={5} xs={11} className={classes.heroOverlay}>
            <Typography variant="h2" paragraph className={classes.heroTitle}>
              Shelby&nbsp;Cook
            </Typography>
            <Typography variant="body2" className={classes.subTitle}>
              I like cats, and&nbsp;art.
            </Typography>
          </Grid>
        </Grid>
      </WidthContainer>
    </div>
  )
}

export default Hero
