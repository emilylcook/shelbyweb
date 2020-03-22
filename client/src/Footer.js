import React from 'react'
import { makeStyles, lighten } from '@material-ui/core/styles'
import { Icon, Typography, Grid } from '@material-ui/core'
import clsx from 'clsx'

export default function ButtonAppBar() {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <Grid container>
        <Grid item xs={12} className={classes.contactMeSection}>
          <Typography>
            <a
              href="https://www.instagram.com/shelbykcook/"
              className={classes.iconContainer}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className={clsx(classes.icon, 'fab fa-instagram')} />
            </a>
            <a
              href="mailto:shelbykcook.art@gmail.com"
              className={classes.iconContainer}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className={clsx(classes.icon, 'fa fa-envelope')} />
            </a>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  footer: {
    height: 50,
    paddingTop: 6,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      height: 50
    }
  },
  iconContainer: {
    margin: '5px 10px'
  },
  icon: {
    color: theme.palette.text.primary,
    // margin: '0 10px',
    fontSize: '2rem',
    transition: '1s all',
    '&:hover': {
      color: lighten(theme.palette.text.primary, 0.25)
    }
  },
  contactMeSection: {
    textAlign: 'right',
    backgroundColor: '#e8e8e8'
  }
}))
