import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Theme, CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

// import config from './config';
import getConfig from './config';
import squareLogo from '../assets/squareLogo.jpg';

const Square = ({ paymentForm, handleCompletePayment }) => {
  const classes = useStyles({});

  // useEffect(() => {
  //   paymentForm = new paymentForm(config);
  //   paymentForm.build();
  // }, []);
  const paymentSubmitCallback = success => {
    if (success) {
      handleCompletePayment();
    } else {
      console.log('AN ERROR?!?!?');
      // do something
    }
  };

  const config = getConfig(paymentSubmitCallback);
  paymentForm = new paymentForm(config);
  paymentForm.build();
  const requestCardNonce = () => {
    paymentForm.requestCardNonce();

    //TODO: if successs
    // handleCompletePayment();
  };

  return (
    <div className={classes.formContainer} id="form-container">
      <div className={classes.input} id="sq-card-number"></div>
      <div className={clsx(classes.input, classes.third)} id="sq-expiration-date"></div>
      <div className={clsx(classes.input, classes.third)} id="sq-cvv"></div>
      <div
        className={clsx(classes.third, classes.input, classes.lastThird)}
        id="sq-postal-code"
      ></div>

      <div className={classes.flex}>
        <img alt="Square Logo" src={squareLogo} className={classes.squareLogo} />
      </div>

      {/* <button onClick={requestCardNonce}>Pay Now</button> */}
      <Button
        variant="contained"
        color="primary"
        onClick={requestCardNonce}
        className={classes.button}
        fullWidth
      >
        Confirm and Pay Now
      </Button>
    </div>
  );
};

const useStyles = makeStyles({
  flex: {},
  button: {
    marginTop: 20,
    marginRight: 10
  },
  squareLogo: {
    height: 100
  },
  formContainer: {
    marginTop: 20,
    minHeight: 300
  },
  input: {
    border: '1px solid gray',
    height: 56
  },
  third: {
    border: '1px solid gray',
    float: `left`,
    width: `calc((100% - 32px) / 3)`,
    padding: 0,
    margin: `0 16px 16px 0`
  },
  lastThird: {
    marginRight: 0
  },
  buttonCreditCard: {
    width: '100%',
    height: 56,
    marginTop: 10,
    background: '#4A90E2',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'block',
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 700,
    letterSpacing: 0,
    textAlign: 'center',
    transition: `background .2s ease-in-out`,

    '&:hover': {
      backgroundColor: `#4281CB`
    }
  }
});

export default Square;
