import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    [theme.breakpoints.down('lg')]: {
      width: '960px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '1080px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mobilePadding: {
    [theme.breakpoints.down('sm')]: {
      padding: '0px 5px'
    }
  }
}))

const WidthContainer = ({ children, fullWidth, className: classNameProp, ...props }) => {
  const classes = useStyles()

  let className = clsx(classes.container, classNameProp)
  if (!fullWidth) {
    className = clsx(classes.container, classNameProp, classes.mobilePadding)
  }
  return (
    <Grid className={classes.root} container>
      <Grid className={className} {...props}>
        {children}
      </Grid>
    </Grid>
  )
}

export default WidthContainer
