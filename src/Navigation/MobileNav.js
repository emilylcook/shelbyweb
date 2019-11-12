import React from 'react'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { HashLink as Link } from 'react-router-hash-link'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { navItems } from '../utils'

const useStyles = makeStyles(theme => ({
  menuIcon: {
    color: theme.palette.text.primary,
    fontSize: '2.5rem !important'
  },
  menuButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    textAlign: 'right'
  },
  list: {
    width: 150
  },
  paper: {
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.text.primary÷
  },
  listItem: {
    textDecoration: 'none !important'
  },
  listItemText: {
    marginLeft: 10,
    color: theme.palette.text.primary
  }
}))

export default function MobileNav() {
  const classes = useStyles()
  //   const commonClasses = useHeaderStyles()
  const [drawerOpenState, setDrawerOpenState] = React.useState(false)

  return (
    <>
      <Typography>SHELBYART</Typography>
      <div className={classes.menuButtonContainer}>
        <Button
          aria-label="Navigation Menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={event => setDrawerOpenState(true)}
          className={classes.menuButton}
        >
          <MenuIcon className={classes.menuIcon} />
        </Button>
      </div>
      <SwipeableDrawer
        data-testid="MobileNavDrawer"
        anchor="right"
        open={drawerOpenState}
        onClose={() => setDrawerOpenState(false)}
        onOpen={() => setDrawerOpenState(true)}
        classes={{ paper: classes.paper }}
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={() => setDrawerOpenState(false)}
          onKeyDown={() => setDrawerOpenState(true)}
        >
          <List id="MobileNavItems">
            {/* main nav items */}
            {Object.entries(navItems).map(([key, { to, label }]) => (
              <ListItem button>
                <ListItemText>
                  <Link smooth to={to} className={classes.listItem}>
                    <Typography className={classes.listItemText}>{label}</Typography>
                  </Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
      </SwipeableDrawer>
      <div className={classes.grow} />
    </>
  )
}
