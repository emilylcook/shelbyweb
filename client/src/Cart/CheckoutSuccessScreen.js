import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import treelineImage from '../assets/treeline.png';

export default function CheckoutSuccessScreen() {
  const classes = useStyles({});

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const orderNumber = params.get('orderNumber');

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.header}>
        <img alt="treelines" src={treelineImage} className={classes.image} />
        <Typography variant="h2" className={classes.title} color="primary" paragraph>
          Order completed!
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={6} className={classes.body}>
        <Typography>
          Thank you for your order! Your order number is <b>{orderNumber}</b>, keep an eye out for
          the email with your receipt. If you have any questions, please email
          shelbykcook.art@gmail.com
        </Typography>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    letterSpacing: '2px',
    fontWeight: 500,
    fontVariant: 'small-caps',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: 35,
      fontWeight: 600
    }
  },
  body: {
    margin: 'auto'
  },
  container: {
    textAlign: 'center',
    justifyContent: 'center',
    display: 'block',
    margin: 20,
    padding: 20,
    width: `calc(100% - 40px)`,
    minHeight: '70vh',
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
  image: {
    width: 200,
    height: 'auto',
    opacity: 0.8,

    [theme.breakpoints.down('xs')]: {
      width: 175
    }
  },
  header: {
    width: '100%',
    height: 'fit-content',
    background: 'white',
    textAlign: 'center'
  }
}));
