import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'

import WidthContainer from './WidthContainer'

const useStyles = makeStyles(theme => ({
  root: {},
  heroOverlay: {
    backgroundColor: 'rgba(255, 255, 255, .7)',
    color: 'black',
    padding: 25,
    paddingBottom: 10,
    position: 'sticky',
    textAlign: 'center',
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
    fontVariant: 'small-caps',
    letterSpacing: 3,
    fontSize: '3.4rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '3rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem'
    }
  },
  subTitle: {
    // marginBottom: '15px'
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
              <Typography variant="h2" className={classes.heroTitle}>
                {title}
              </Typography>
              {subText && (
                <Typography variant="body2" className={classes.subTitle}>
                  {subText}
                </Typography>
              )}
            </Grid>
          </Grid>
        </WidthContainer>
      )}
    </div>
  )
}

export default Hero
