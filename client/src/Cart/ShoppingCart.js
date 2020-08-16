import React, { useState, useEffect } from 'react';
import { Grid, createStyles, makeStyles, CircularProgress, TextField } from '@material-ui/core';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

import Square from './Square';

const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}/;

export default function ShoppingCart() {
  const classes = useStyles({});

  const [completed, setCompleted] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [formFields, setFormFields] = React.useState({});
  const setFormField = (name, val) => {
    setFormFields({ ...formFields, [name]: val });
  };

  console.log('formFields', formFields);
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const checkIfValid = () => {
    let valid = false;
    if (activeStep === 0) {
      if (formFields.email && emailRegex.test(formFields.email)) {
        valid = true;
      }
    } else {
      // todo shipping/billing validation

      valid = true;
    }

    return valid;
  };

  const canGoToNextStep = checkIfValid();

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    let sqPaymentScript = document.createElement('script');
    // sandbox: https://js.squareupsandbox.com/v2/paymentform
    // production: https://js.squareup.com/v2/paymentform
    sqPaymentScript.src = 'https://js.squareupsandbox.com/v2/paymentform';
    sqPaymentScript.type = 'text/javascript';
    sqPaymentScript.async = false;
    sqPaymentScript.onload = () => {
      setLoad(true);
    };

    document.getElementsByTagName('head')[0].appendChild(sqPaymentScript);
  });

  function getSteps() {
    return ['Email', 'Shipping & Billing address', 'Payment'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <TextField
              className={classes.textfield}
              variant="outlined"
              label="Email"
              placeholder="enter your email"
              onChange={event => {
                setFormField('email', event.target.value);
              }}
              defaultValue={formFields?.email}
              fullWidth
            ></TextField>
            <Typography paragraph>
              You'll receive your receipt and notifications at this email.
            </Typography>
          </div>
        );
      case 1:
        return <div>'Shipping'</div>;
      case 2:
        return (
          <Square
            handleCompletePayment={handleCompletePayment}
            paymentForm={window.SqPaymentForm}
          />
        );
      // case 4:
      //   return <div>Review &amp; Purchase</div>;
      default:
        return 'Unknown step';
    }
  }

  if (!isLoad) {
    return <CircularProgress />;
  }

  const handleCompletePayment = () => {
    handleNext();
    setCompleted(true);

    // TODO: clear out cart and such too
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6}>
        {/* <Square paymentForm={window.SqPaymentForm} /> */}
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={null}
          className={classes.stepper}
        >
          {steps.map((label, index) => (
            <Step key={label} className={clsx(classes.step, classes.container)}>
              <StepLabel
                onClick={() => (!completed && activeStep > index ? setActiveStep(index) : null)}
              >
                {label}
              </StepLabel>

              {/* <div
                className={clsx({
                  [classes.visible]: index === activeStep,
                  [classes.hidden]: index !== activeStep
                })}
              > */}
              <StepContent>
                {getStepContent(index)}
                {activeStep !== steps.length - 1 && (
                  <div className={classes.actionsContainer}>
                    <Button
                      disabled={!canGoToNextStep}
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                      fullWidth
                    >
                      {activeStep === steps.length - 1 ? 'Confirm and Pay' : 'Continue'}
                    </Button>
                  </div>
                )}
                {/* <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Confirm and Pay' : 'Next'}
                    </Button>
                  </div> */}
                {/* </div> */}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={clsx(classes.step, classes.resetContainer)}>
            <Typography variant="h4" paragraph>
              Checkout completed
            </Typography>
            <Typography>A receipt will be sent to your email.</Typography>
            {/* <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button> */}
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} sm={6} className={classes.container}>
        <Typography variant="h3" paragraph>
          Order Summary
        </Typography>
        TODO: list the items in the cart! and shipping once we know it and such
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  textfield: { marginTop: 10, marginBottom: 20 },
  hidden: {
    visibility: 'hidden',
    // display: 'none',
    transition: 'visibility 0s, opacity 1s linear',
    opacity: 0,
    height: 0,
    maxHeight: 0,
    overflow: 'hidden'
  },
  visible: {
    visibility: 'visible',
    transition: 'visibility 0s, opacity 1s linear',
    display: 'block',
    opacity: 1
  },
  root: {
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 10,
      padding: 5
    }
  },
  button: {
    marginTop: 10,
    marginRight: 10
  },
  actionsContainer: {
    marginBottom: 20
  },
  resetContainer: {
    padding: 20,
    marginRight: 20
  },
  stepper: {
    background: 'none',
    padding: 0,
    paddingRight: 20,
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0
    }
  },
  container: {
    background: 'white',
    padding: 20,
    border: `thin solid #F2F3F2`
  },
  step: {
    marginBottom: 20
  }
}));
