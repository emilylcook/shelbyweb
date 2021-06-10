import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import OrderSummary from './OrderSummary';

export default function ShoppingCartScreen() {
  const classes = useStyles({});

  return (
    <Grid container className={classes.summary}>
      <Grid item className={classes.cart}>
        <OrderSummary completed={false} cartView={true} />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  summary: {
    margin: 20,
    padding: 20,
    width: `calc(100% - 40px)`,
    [theme.breakpoints.down('xs')]: {
      margin: 5,
      padding: 5,
      marginTop: 15,
      paddingBottom: 15,
      width: `calc(100% - 10px)`
    },

    height: 'fit-content',
    background: 'white',
    border: `thin solid #F2F3F2`
  },
  cart: {
    width: '100%',
    height: 'fit-content',
    background: 'white'
  }
}));
