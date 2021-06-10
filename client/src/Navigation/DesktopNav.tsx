import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { HashLink as Link } from 'react-router-hash-link';
import { Grid, Typography } from '@material-ui/core';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import clsx from 'clsx';

import { navItems } from '../utils/isFormSubmitDisabled';
import Logo from './Logo';
import { getNumberOfItemsInCart } from '../utils/useCartData';
import useAuth from '../utils/useAuth';

export default function DesktopNav() {
  const classes = useStyles();
  const [hoverOn, setHoverOn] = useState<string | null>(null);
  const [itemsInCart, setItemsInCart] = useState();
  const { isAuthenticated } = useAuth();

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

  return (
    <>
      <Logo />
      <Grid justify="flex-end" container spacing={2}>
        {Object.entries(navItems).map(([key, { to, label, subItems }]) => (
          <Grid key={key} item className={classes.navItem}>
            <div
              className={clsx(classes.listItemContainer, {
                [classes.listItemContainerBefore]: key !== 'home'
              })}
            >
              {subItems ? (
                <div key={key}>
                  <Typography className={classes.listItem} onMouseEnter={() => setHoverOn(key)}>
                    {label}
                  </Typography>
                  <div
                    onMouseLeave={() => setHoverOn('')}
                    className={clsx(classes.subMenu, {
                      [classes.subMenuHidden]: hoverOn !== key
                    })}
                  >
                    {Object.entries(subItems).map(([key, { to, label }]) => (
                      <div key={key} className={classes.subMenuItemContainer}>
                        <Link to={to} className={classes.subMenuItem}>
                          {label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={key}
                  to={to ?? '/'}
                  onMouseEnter={() => setHoverOn(key)}
                  className={classes.listItem}
                >
                  {label}
                </Link>
              )}
            </div>
          </Grid>
        ))}
        <Grid item>
          <Link to={itemsInCart ? '/cart' : '/'} onMouseEnter={() => setHoverOn(null)}>
            <Badge badgeContent={itemsInCart} color="primary">
              <ShoppingCartIcon className={classes.shoppingCartIcon} />
            </Badge>
          </Link>
        </Grid>

        {isAuthenticated && (
          <Grid item className={classes.navItem}>
            <div className={clsx(classes.listItemContainer)}>
              <div key="admin">
                <Typography className={classes.listItem} onMouseEnter={() => setHoverOn('admin')}>
                  Admin
                </Typography>
                <div
                  onMouseLeave={() => setHoverOn('')}
                  className={clsx(classes.subMenu, {
                    [classes.subMenuHidden]: hoverOn !== 'admin'
                  })}
                >
                  <div key="admin/logout" className={classes.subMenuItemContainer}>
                    <Link to={'/logout'} className={classes.subMenuItem}>
                      logout
                    </Link>
                  </div>

                  <div key="admin/manage" className={classes.subMenuItemContainer}>
                    <Link to={'/admin/manage'} className={classes.subMenuItem}>
                      manage arts
                    </Link>
                  </div>

                  <div key="admin/manage-collections" className={classes.subMenuItemContainer}>
                    <Link to={'/admin/manage-collections'} className={classes.subMenuItem}>
                      manage collections
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  shoppingCartIcon: {
    color: theme.palette.text.primary,
    cursor: 'pointer'
  },
  logo: {
    height: 50
  },
  navButton: {
    padding: '10px 5px',
    borderRadius: 5,
    transition: 'all 1s'
  },
  listItem: {
    textDecoration: 'none !important',
    color: 'black',
    fontSize: 11,
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
  },
  subMenu: {
    zIndex: 3,
    position: 'absolute',
    top: 30,
    width: 180,
    // left: -20,
    margin: 0,
    padding: '12px 20px',
    backgroundColor: '#272B2F',
    fontSize: 9
  },
  subMenuItemContainer: {
    position: 'relative',
    width: 'fit-content',
    letterSpacing: 4,
    marginBottom: 5
  },
  subMenuHidden: {
    display: 'none'
  },
  subMenuItem: {
    textDecoration: 'none !important',
    color: 'white',
    lineHeight: 2,
    fontSize: 11,
    '&::before': {
      position: 'absolute',
      bottom: -2,
      left: '50%',
      width: 0,
      height: 1,
      marginLeft: 0,
      backgroundColor: 'white',
      content: "''",
      transitionDuration: '.2s'
    },
    '&:hover::before': {
      width: 'calc(100% - 4px)',
      marginLeft: '-50%'
    }
  },
  homeLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  navItem: {}
}));
