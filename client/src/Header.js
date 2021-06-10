import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';

import { MobileNav, DesktopNav } from './Navigation';
import WidthContainer from './common/WidthContainer';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    boxShadow: 'none'
  },
  navContainerRootMobile: {
    // justifyContent: 'flex-end'
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="absolute" className={classes.root}>
        <div className={classes.nav}>
          <Hidden className={classes.desktop} only={['xs', 'sm']}>
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
      <div className={classes.bgImage}></div>
    </>
  );
}
