import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';

import { MobileNav, DesktopNav } from './Navigation';
import WidthContainer from './common/WidthContainer';

export default function Header() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="absolute" className={classes.root}>
        <div>
          <Hidden only={['xs', 'sm']}>
            <WidthContainer>
              <Toolbar disableGutters>
                <DesktopNav />
              </Toolbar>
            </WidthContainer>
          </Hidden>

          <Hidden only={['md', 'lg', 'xl']}>
            <Toolbar classes={{ root: classes.navContainerRootMobile }}>
              <MobileNav />
            </Toolbar>
          </Hidden>
        </div>
      </AppBar>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    boxShadow: 'none'
  },
  navContainerRootMobile: {}
}));
