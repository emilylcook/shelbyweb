import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'

import WidthContainer from './WidthContainer'

const useStyles = makeStyles(theme => ({
  root: {
    // height: 'calc(100vh - 64px)',
    // height: 700,
    // maxHeight: '80%',
    // width: 'calc(100vw)',
    // filter: 'grayscale(74%)',
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
    // background: `url(${HeroImg}) center center no-repeat rgb(217, 217, 217)`,
    // display: 'flex',
    // backgroundSize: 'cover',
    // flexDirection: 'column'
  },
  heroOverlay: {
    backgroundColor: 'rgba(255, 255, 255, .9)',
    color: 'black',
    textAlign: 'left',
    padding: 35,
    minHeight: 180,
    position: 'sticky',
    // [theme.breakpoints.down('xs')]: {
    //   padding: 25
    // },
    [theme.breakpoints.up('md')]: {
      minWidth: 430
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 360
    },
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
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem'
    },
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

function Hero({ heroImg, grayscale = '74%', subText, title }) {
  const useHeroStyles = makeStyles(theme => ({
    heroImageStyle: {
      height: 700,
      maxHeight: '80%',
      // width: 'calc(100vw)',
      width: '100%',
      filter: `grayscale(${grayscale})`,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      background: `url(${heroImg}) center center no-repeat rgb(217, 217, 217)`,
      display: 'flex',
      backgroundSize: 'cover',
      flexDirection: 'column'
    }
  }))

  const classes = useStyles()
  const heroStyles = useHeroStyles()

  return (
    <div className={clsx(classes.root, heroStyles.heroImageStyle)}>
      {title && (
        <WidthContainer fullWidth={true} className={classes.columnWrapper}>
          <Grid container spacing={0} className={classes.container}>
            <Grid item md={5} sm={6} xs={11} className={classes.heroOverlay}>
              <Typography variant="h2" paragraph className={classes.heroTitle}>
                {title}
              </Typography>
              <Typography variant="body2" className={classes.subTitle}>
                {subText}
              </Typography>
            </Grid>
          </Grid>
        </WidthContainer>
      )}
    </div>
  )
}

export default Hero
