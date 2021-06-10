import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import logoImg from '../assets/signature.png';

const useStyles = makeStyles(theme => ({
  logo: {
    height: 50
  }
}));

export default function Logo() {
  const classes = useStyles();

  return (
    <a href="/">
      <img src={logoImg} alt="logo" className={classes.logo} />
    </a>
  );
}
