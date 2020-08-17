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
import { useSnackbar } from 'notistack';
import clsx from 'clsx';

import { clearCart, getItemsInCart, removeItemFromCart } from '../utils/useCartData';
import Square from './Square';
import { billingAddressFields, emailRegex, shippingAddressFields } from './helpers';

export default function ShoppingCart() {
  const classes = useStyles({});

  const [completed, setCompleted] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const [itemsInCart, setItemsInCart] = useState(getItemsInCart() || []);
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

    // on success:
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    clearCart();
    setCompleted(true);
  };

  const pricesInCart = itemsInCart.flatMap(x => x.price);
  let subTotal = pricesInCart
    .reduce(function(a, b) {
      return a + b;
    }, 0)
    .toFixed(2);

  let taxes = null;
  let shipping = null;
  let totalAmount = parseFloat(subTotal);
  if (shipping) {
    totalAmount += shipping;
  }
  if (taxes) {
    totalAmount += taxes;
  }

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
        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" paragraph>
                AHH FINALIZE!
              </Typography>
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

  const removeItem = async id => {
    const result = await removeItemFromCart(id);

    if (result) {
      const modifiedItems = [...itemsInCart];
      const itemToRemove = modifiedItems.findIndex(x => x.id === id);
      modifiedItems.splice(itemToRemove, 1);

      setItemsInCart(modifiedItems);

      console.log(modifiedItems);
      enqueueSnackbar('Removed item from cart!', {
        variant: 'success',
        autoHideDuration: 4500
      });
    } else {
      enqueueSnackbar('Unable to remove item', {
        variant: 'error',
        autoHideDuration: 4500
      });
    }
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
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h3" paragraph className={classes.h3}>
              Order Summary
            </Typography>
          </Grid>

          {itemsInCart.map(item => {
            const { id, name, path, info, price, quantity } = item;

            const details = `${info.size} - ${info.type}`;
            return (
              <Grid item xs={12} className={classes.lineContainer}>
                <Grid container className={classes.lineItem}>
                  <Grid item>
                    <img className={classes.image} alt={name} src={path} />
                  </Grid>
                  <Grid item className={classes.imageDetails}>
                    <Typography className={classes.info}>{name}</Typography>
                    <Typography className={classes.details}>{details}</Typography>
                  </Grid>
                  <Grid item className={classes.priceContainer}>
                    <Typography className={classes.price}>${price} USD</Typography>
                    <Typography className={classes.quantity}>Quantity {quantity}</Typography>
                  </Grid>
                </Grid>
                <Button
                  className={classes.removeButton}
                  variant="outlined"
                  color="default"
                  onClick={() => removeItem(id)}
                >
                  Remove
                </Button>
              </Grid>
            );
          })}

          <Grid item xs={12} className={classes.costInfoContainer}>
            <div className={classes.row}>
              <Typography className={classes.costLabel}>SubTotal</Typography>
              <Typography className={classes.dollarAmount}>${subTotal} USD</Typography>
            </div>
            <div className={classes.row}>
              <Typography className={classes.costLabel}>Tax</Typography>
              <Typography className={classes.dollarAmount}>
                {taxes ? `$${taxes} USD` : '-'}
              </Typography>
            </div>
            <div className={classes.row}>
              <Typography className={classes.costLabel}>Shipping</Typography>
              <Typography className={classes.dollarAmount}>
                {shipping ? `$${shipping} USD` : '-'}
              </Typography>
            </div>
            <div className={classes.totalRow}>
              <Typography className={classes.totalLabel}>Total</Typography>
              <Typography className={classes.totalPrice}>${totalAmount} USD</Typography>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  costInfoContainer: { marginTop: 20 },
  totalRow: { display: 'flex', marginTop: 10 },
  row: { display: 'flex' },
  totalPrice: {
    fontWeight: 600
  },
  totalLabel: {
    fontWeight: 600,
    flex: 1
  },
  costLabel: {
    color: 'gray',
    flex: 1
  },
  dollarAmount: {
    color: 'gray'
  },
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
  h3: {
    marginBottom: 30,
    fontSize: 40,
    [theme.breakpoints.down('sm')]: {
      fontSize: 30
    }
  },
  price: { fontWeight: 600 },
  priceContainer: {
    width: 100,
    textAlign: 'right',

    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: 70
    }
  },
  quantity: { fontColor: 'gray', fontSize: 12 },
  imageDetails: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  info: { fontWeight: 600 },
  details: { fontColor: 'gray' },
  lineContainer: {
    marginBottom: 20,
    position: 'relative'
  },
  lineItem: {
    display: 'flex',
    alignItems: 'end',
    paddingBottom: 10,
    borderBottom: `thin solid #ededed`
  },

  image: {
    marginRight: 40,
    maxWidth: '100px',
    maxHeight: '100px',
    width: 'auto',
    // margin: 'auto',
    height: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginRight: 20
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: 15
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
    background: 'white',
    padding: 20,
    border: `thin solid #F2F3F2`
  },
  step: {
    marginBottom: 20
  }
}));
