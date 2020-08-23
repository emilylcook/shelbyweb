import React, { useState, useEffect } from 'react';
import { Grid, makeStyles, CircularProgress, FormControlLabel, TextField } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';

import { clearCart } from '../utils/useCartData';
import Square from './Square';
import OrderSummary from './OrderSummary';
import { billingAddressFields, emailRegex, shippingAddressFields } from './helpers';

// TODO verify items are in cart are still available at some point

export default function CheckoutScreen() {
  const classes = useStyles({});

  const [completed, setCompleted] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = getSteps();

  const [formFields, setFormFields] = React.useState({ billingSameAsShipping: true });
  const setFormField = (name, val) => {
    setFormFields({ ...formFields, [name]: val });
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleCompletePayment = () => {
    // TODO api call to actually do this
    console.log('formFields', formFields);
    // build api call to make

    // on success:
    // setActiveStep(prevActiveStep => prevActiveStep + 1);
    // clearCart();
    // setCompleted(true);
  };

  const checkIfValid = () => {
    let valid = false;
    switch (activeStep) {
      case 0:
        // validate email
        if (formFields.email && emailRegex.test(formFields.email)) {
          valid = true;
        }
        break;
      case 1:
        // validate shipping & billing
        const shippingAddressRequired = shippingAddressFields
          .filter(x => x.required)
          .map(f => f.key);

        const shippingValid = shippingAddressRequired.every(x => formFields[x]);

        if (shippingValid && formFields.billingSameAsShipping) {
          valid = true;
        } else if (shippingValid) {
          const billingAddressRequired = billingAddressFields
            .filter(x => x.required)
            .map(f => f.key);
          const billingValid = billingAddressRequired.every(x => formFields[x]);

          if (billingValid) {
            valid = true;
          }
        }

        break;
      case 2:
        // validate payment info collected
        if (formFields.nonce) {
          valid = true;
        }
        break;
      case 3:
        valid = true;
        break;
      default:
        valid = true;
        break;
    }

    return valid;
  };

  const canGoToNextStep = checkIfValid();

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
    return ['Email', 'Shipping & Billing', 'Payment', 'Review & Purchase'];
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
              defaultValue={formFields?.email || ''}
              fullWidth
            ></TextField>
            <Typography paragraph>
              You'll receive your receipt and notifications at this email.
            </Typography>
          </div>
        );
      case 1:
        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography>Shipping Address</Typography>
            </Grid>
            {shippingAddressFields.map(x => {
              return (
                <Grid item key={x.key} xs={x.xs} sm={x.sm} className={classes.formItem}>
                  <TextField
                    className={classes.textfield}
                    variant="outlined"
                    label={x.label}
                    onChange={event => {
                      setFormField(x.key, event.target.value);
                    }}
                    defaultValue={formFields[x.key] || ''}
                    fullWidth
                    name={x.name}
                  ></TextField>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Typography>Billing Address</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label={'Billing same as shipping?'}
                control={
                  <Checkbox
                    defaultChecked={formFields.billingSameAsShipping}
                    name={'billingSameAsShipping'}
                    color="primary"
                    onClick={event => {
                      setFormField('billingSameAsShipping', !formFields.billingSameAsShipping);
                    }}
                  />
                }
              />
            </Grid>

            {!formFields.billingSameAsShipping &&
              billingAddressFields.map(x => {
                return (
                  <Grid item key={x.key} xs={x.xs} sm={x.sm} className={classes.formItem}>
                    <TextField
                      className={classes.textfield}
                      variant="outlined"
                      label={x.label}
                      onChange={event => {
                        setFormField(x.key, event.target.value);
                      }}
                      defaultValue={formFields[x.key] || ''}
                      fullWidth
                    ></TextField>
                  </Grid>
                );
              })}
          </Grid>
        );
      case 2:
        return <Square handleSquare={handleSquare} paymentForm={window.SqPaymentForm} />;
      case 3:
        const shippingStreetAddress = formFields?.shippingStreetAddress2
          ? `${formFields?.shippingStreetAddress} ${formFields?.shippingStreetAddress2}`
          : formFields?.shippingStreetAddress;

        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" paragraph>
                Review ?
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.reviewRow}>
              <Typography className={classes.label}>Email</Typography>
              <Typography className={classes.value}>{formFields.email}</Typography>
            </Grid>

            <Grid item xs={12} className={classes.reviewRow}>
              <Typography className={classes.label}>Shipping Address</Typography>
              <Typography className={classes.value}>
                {formFields?.shippingFirstName} {formFields?.shippingLastName}
                <br />
                {shippingStreetAddress},<br />
                {formFields?.shippingCity}, {formFields?.shippingState} {formFields?.shippingPostal}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.reviewRow}>
              <Typography className={classes.label}>Billing</Typography>
              {formFields?.billingSameAsShipping ? (
                <Typography className={classes.value}>Same as shipping</Typography>
              ) : (
                'address'
              )}
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  }

  if (!isLoad) {
    return <CircularProgress />;
  }

  const handleSquare = nonce => {
    setFormField('nonce', nonce);
    handleNext();
    // setCompleted(true);

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
                {activeStep !== 2 && (
                  <div className={classes.actionsContainer}>
                    <Button
                      disabled={!canGoToNextStep}
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        activeStep === steps.length - 1 ? handleCompletePayment() : handleNext()
                      }
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
        <OrderSummary completed={completed} />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  label: {
    fontWeight: 600
  },
  reviewRow: { marginBottom: 10 },
  row: { display: 'flex' },
  removeButton: {
    position: 'absolute',
    bottom: 6,
    right: 0,
    color: 'gray',
    height: 20,
    textTransform: 'capitalize',
    fontSize: 12,
    [theme.breakpoints.down('xs')]: {
      bottom: 10
    }
  },
  formItem: {
    paddingLeft: 10,
    paddingRight: 10
  },
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
      padding: 5,
      flexDirection: `column-reverse`
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
      paddingRight: 0,
      marginTop: 20
    }
  },
  container: {
    height: 'fit-content',
    background: 'white',
    padding: 20,
    border: `thin solid #F2F3F2`
  },
  step: {
    marginBottom: 20
  }
}));
