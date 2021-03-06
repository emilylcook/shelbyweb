import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { HashLink as Link } from 'react-router-hash-link';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';

import { navItems } from '../utils/isFormSubmitDisabled';
import Logo from './Logo';
import { getNumberOfItemsInCart } from '../utils/useCartData';

export default function MobileNav() {
  const classes = useStyles();
  const [drawerOpenState, setDrawerOpenState] = React.useState(false);
  const [open, setOpen] = React.useState(new Set());

  const [itemsInCart, setItemsInCart] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const cartCheck = getNumberOfItemsInCart();

      if (itemsInCart !== cartCheck) {
        setItemsInCart(cartCheck);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  function handleClick(name: string) {
    const isOpen = open.has(name);
    let newSet = open;

    if (isOpen) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }

    setOpen(new Set(newSet));
  }

  return (
    <>
      <Logo />
      <div className={classes.menuButtonContainer}>
        <Button
          aria-label="Navigation Menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={event => setDrawerOpenState(true)}
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
            {Object.entries(navItems).map(([key, { to, label, subItems }]) => {
              const isOpen = open.has(key);

              return subItems ? (
                <div key={key}>
                  <ListItem
                    button
                    onClick={e => {
                      e.stopPropagation();
                      handleClick(key);
                    }}
                    className={clsx({ [classes.isOpen]: isOpen })}
                  >
                    <ListItemText primary={label} classes={{ root: classes.listItemText }} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={isOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.subMenuContainer}
                  >
                    <List component="div" disablePadding className={classes.subItemList}>
                      {/* foreach item in subnav */}
                      {Object.entries(subItems).map(([key, { to, label }]) => (
                        <ListItem key={key} button>
                          <ListItemText>
                            <Link smooth to={to} className={classes.listItem}>
                              <Typography className={classes.listItemText}>{label}</Typography>
                            </Link>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              ) : (
                <ListItem key={key} button>
                  <ListItemText>
                    <Link smooth to={to ?? '/'} className={classes.listItem}>
                      <Typography className={classes.listItemText}>{label}</Typography>
                    </Link>
                  </ListItemText>
                </ListItem>
              );
            })}

            <ListItem>
              <ListItemText>
                <Link smooth to={itemsInCart ? '/cart' : '/'} className={classes.listItem}>
                  <Badge badgeContent={itemsInCart} color="primary">
                    <Typography className={classes.listItemText}>Cart</Typography>
                    <ShoppingCartIcon className={classes.shoppingCartIcon} />
                  </Badge>
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  shoppingCartIcon: {
    marginLeft: 10,
    color: theme.palette.text.primary,
    cursor: 'pointer'
  },
  logo: {
    height: 50
  },
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
    width: 200
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
  },
  subItemList: {
    marginLeft: 30
  },
  isOpen: {
    borderTop: 'thin solid #f5f5f5',
    background: '#f5f5f5'
  },
  subMenuContainer: {
    borderBottom: 'thin solid #f5f5f5',
    paddingBottom: 10,
    background: '#f5f5f5'
  },
  homeLink: {
    textDecoration: 'none',
    color: 'inherit'
  }
}));
