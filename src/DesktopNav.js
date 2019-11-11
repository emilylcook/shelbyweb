import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { HashLink as Link } from 'react-router-hash-link'
import { Grid, Typography } from '@material-ui/core'

import clsx from 'clsx'

import { navItems } from './utils'

const useStyles = makeStyles(theme => ({
  navButton: {
    padding: '10px 5px',
    borderRadius: 5,
    transition: 'all 1s'
  },
  listItem: {
    textDecoration: 'none !important',
    color: 'black',
    '&::before': {
      position: 'absolute',
      bottom: -2,
      left: '50%',
      width: 0,
      height: 1,
      marginLeft: 0,
      backgroundColor: '#272B2F',
      content: "''",
      transitionDuration: '.2s'
    },
    '&:hover::before': {
      // dont do if first
      width: 'calc(100% - 4px)',
      marginLeft: '-50%'
    }
  },
  listItemContainer: {
    textTransform: 'uppercase',
    margin: 0,
    fontSize: 11,
    letterSpacing: 4,
    position: 'relative',
    display: 'inline-block',
    marginLeft: 20
  },
  listItemContainerBefore: {
    '&:before': {
      position: 'absolute',
      top: 7,
      left: -20,
      width: 2,
      height: 2,
      backgroundColor: '#272B2F',
      content: "''"
    }
  }
}))

export default function ButtonAppBar() {
  const classes = useStyles()

  return (
    <>
      <Typography>SHELBYART</Typography>
      <Grid justify="flex-end" container spacing={2}>
        {/* <ul> */}
        {Object.entries(navItems).map(([key, { to, label }]) => (
          <Grid key={key} item className={classes.navItem}>
            {/* <Button className={classes.navButton}> */}
            <div
              className={clsx(classes.listItemContainer, {
                [classes.listItemContainerBefore]: key !== 'home'
              })}
            >
              <Link
                smooth
                to={to}
                className={classes.listItem}
                scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {label}
              </Link>
            </div>
            {/* </Button> */}
          </Grid>
        ))}
        {/* </ul> */}
      </Grid>
    </>
  )
}
