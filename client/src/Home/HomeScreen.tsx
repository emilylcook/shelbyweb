import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Theme, Typography } from '@material-ui/core';

import Hero from '../common/Hero';
import treelineImage from '../assets/treeline.png';
import heroImg from '../assets/hero/Scotland1.jpg';

import Newsletter from './Newsletter';

const HomeScreen = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.content}>
        <Hero heroImg={heroImg}>
          <div className={classes.titleSection}>
            <img alt="treelines" src={treelineImage} className={classes.image} />
            <Typography className={classes.title}>SHELBY K COOK</Typography>
          </div>
        </Hero>
      </div>
      <Newsletter />
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },

  content: {
    minHeight: '100vh',
    [theme.breakpoints.down('xs')]: {
      // marginBottom: 100
    }
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    fontVariant: 'small-caps',
    height: 130
  },
  title: {
    fontSize: '2rem',
    letterSpacing: 3
  },
  image: {
    width: 200,
    height: 'auto',
    opacity: 0.8,

    [theme.breakpoints.down('xs')]: {
      width: 175
    }
  }
}));

export default HomeScreen;
