import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import Hero from './Hero'
import WidthContainer from '../WidthContainer'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },

  section: {}
}))

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.content}>
      <Hero />
      {/* <WidthContainer className={classes.columnWrapper}>
        <Grid container>
          <Grid item xs={12} className={clsx(classes.section)}></Grid>
        </Grid>
      </WidthContainer> */}
    </div>
  )
}

export default Home
