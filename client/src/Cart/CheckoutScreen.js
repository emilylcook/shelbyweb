import React, { useState, useEffect } from 'react';
import {
  Grid,
  makeStyles,
  CircularProgress,
  FormControl,
  Select,
  FormControlLabel,
  TextField,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router';
import axios from 'axios';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';

import {
  clearCart,
  getItemsInCart,
  removeItemFromCart,
  getSalesRate,
  addOrderToDatabase
} from '../utils/useCartData';
import Square from './Square';
import OrderSummary from './OrderSummary';
import {
  billingAddressFields,
  emailRegex,
  calculateShippingCosts,
  validateAddress,
  shippingAddressFields
} from './helpers';
import { removeItemFromCollection } from '../utils/useCollectionData';
import AddressModal from './AddressModal';
import config from '../config';
import { confirmItemIsAvailable } from '../utils/useCollectionData';

export default function CheckoutScreen() {
  const classes = useStyles({});
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoad, setLoad] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [recommendedAddress, setRecommendedAddress] = React.useState(null);

  const steps = getSteps();

  const [formFields, setFormFields] = React.useState({ billingSameAsShipping: true });
  const [discount, setDiscount] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = promo => {
    if (!promo) {
      setDiscount(0);
      setPromoCode(null);
      return;
    }

    const { code, discount } = promo;
    setDiscount(discount);
    setPromoCode(code);
  };

  const setFormField = (name, val) => {
    setFormFields({ ...formFields, [name]: val });
  };

  const checkIfEqual = (string1, string2) => {
    if (!string1 && !string2) {
      return true;
    }
    if ((string1 && !string2) || (!string1 && string2)) {
      return false;
    }

    const result = string1.toUpperCase() === string2.toUpperCase();
    return result;
  };

  const handleNext = async () => {
    let error = false;
    let showRecommendAddressModal = false;

    setLoading(true);
    const shippingInternational = formFields?.shippingCountry !== 'UnitedStates';

    if (activeStep === 1) {
      const itemsInCart = getItemsInCart();
      const shippingCost = await calculateShippingCosts(formFields, itemsInCart);

      if (shippingCost === null || shippingCost === 0 || !shippingCost || shippingCost >= 100000) {
        setError('Unable to calculate shipping');
        error = true;
      }

      let salesTaxRate = 0;
      if (!shippingInternational) {
        const validateAddressResult = await validateAddress(formFields);

        if (validateAddressResult.error || !validateAddressResult.address) {
          enqueueSnackbar('Unable to verify address, Please check and try again', {
            variant: 'error',
            autoHideDuration: 4500
          });
          error = true;
        } else {
          const { address1, address2, city, state, zip5, zip4 } = validateAddressResult.address;

          const {
            shippingStreetAddress,
            shippingStreetAddress2 = null,
            shippingPostal,
            shippingCity,
            shippingState
          } = formFields;

          if (
            !error &&
            (!checkIfEqual(shippingStreetAddress, address1) ||
              !checkIfEqual(shippingStreetAddress2, address2) ||
              !checkIfEqual(shippingCity, city) ||
              !checkIfEqual(shippingState, state) ||
              !checkIfEqual(shippingPostal, `${zip5}-${zip4}`))
          ) {
            showRecommendAddressModal = true;
          } else {
            showRecommendAddressModal = false;
          }

          // IF showRecommendAddressModal
          if (showRecommendAddressModal) {
            setRecommendedAddress(validateAddressResult.address);
          }
          salesTaxRate = await getSalesRate(zip5, zip4);
          setFormFields({ ...formFields, salesTaxRate, shippingCost, zip4 });
        }
      } else {
        // international
        setFormFields({
          ...formFields,
          salesTaxRate,
          shippingCost,
          zip4: formFields.shippingPostal
        });
      }
    }
    if (!error && !showRecommendAddressModal) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    setLoading(false);
  };

  const handleSelectAddress = address => {
    if (address) {
      const { address1, address2, city, state, zip5, zip4 } = address;

      setFormFields({
        ...formFields,
        ...{
          shippingStreetAddress: address1,
          shippingStreetAddress2: address2,
          shippingCity: city,
          shippingState: state,
          shippingPostal: `${zip5}-${zip4}`
        }
      });
    }

    // and move forward!
    setRecommendedAddress(null);

    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleCompletePayment = async () => {
    let finalItems = getItemsInCart();

    if (finalItems && finalItems.length > 0) {
      await Promise.all(
        finalItems.map(async x => {
          const availableInDatabase = await confirmItemIsAvailable(x.collectionId, x.id);

          if (!availableInDatabase) {
            // if item is not available, remove it
            const result = await removeItemFromCart(x.id);
            if (result) {
              const modifiedItems = [...finalItems];
              const itemToRemove = modifiedItems.findIndex(y => y.id === x.id);
              modifiedItems.splice(itemToRemove, 1);

              finalItems = modifiedItems;
            }

            enqueueSnackbar(`${x.name} is no longer available`, {
              variant: 'error',
              autoHideDuration: 4500
            });
          }
          return;
        })
      );
    }

    if (!finalItems || finalItems.length === 0) {
      setTimeout(function() {
        history.push('/cart');
      }, 4500);
    }

    const pricesInCart = finalItems?.flatMap(x => x.price);
    let subTotal = pricesInCart
      .reduce(function(a, b) {
        return a + b;
      }, 0)
      .toFixed(2);

    subTotal = parseFloat(subTotal);

    const shipping = formFields?.shippingCost || 0;
    const taxes = parseFloat((subTotal * formFields.salesTaxRate).toFixed(2));

    let totalAmount = parseFloat(subTotal);
    if (shipping) {
      totalAmount += parseFloat(shipping);
    }
    if (taxes) {
      totalAmount += parseFloat(taxes);
      totalAmount = parseFloat(totalAmount.toFixed(2));
    }

    if (discount) {
      totalAmount = totalAmount - discount;
    }

    let lineItems = finalItems.map(art => {
      return {
        id: art.id,
        type: 'art',
        label: art.name,
        amount: art.price,
        pending: false
      };
    });

    lineItems.push({
      label: 'Subtotal',
      amount: subTotal,
      pending: false
    });

    lineItems.push({
      label: 'Shipping',
      amount: shipping,
      pending: false
    });

    if (discount && promoCode) {
      lineItems.push({
        label: `Promo ${promoCode}`,
        amount: -discount,
        pending: false
      });
    }

    lineItems.push({
      label: 'Taxes',
      amount: taxes,
      pending: false
    });

    const shippingContact = {
      first_name: formFields?.shippingFirstName,
      last_name: formFields?.shippingLastName,
      locality: formFields?.shippingCity,
      administrative_district_level_1: formFields?.shippingState,
      postal_code: formFields?.shippingPostal,
      address_line_1: formFields?.shippingStreetAddress,
      address_line_2: formFields?.shippingStreetAddress2
    };

    const billingContact = formFields?.billingSameAsShipping
      ? shippingContact
      : {
          first_name: formFields?.billingFirstName,
          last_name: formFields?.billingLastName,
          locality: formFields?.billingCity,
          administrative_district_level_1: formFields?.billingState,
          postal_code: formFields?.billingPostal,
          address_line_1: formFields?.billingStreetAddress,
          address_line_2: formFields?.billingStreetAddress2
        };

    const paymentRequestJson = {
      nonce: formFields?.nonce,
      email: formFields?.email,
      shippingContact,
      billingContact,
      currencyCode: 'USD',
      countryCode: 'US',
      total: totalAmount,
      lineItems
    };

    axios
      .post(`${config.API}/checkout`, paymentRequestJson)
      .then(function(response) {
        if (response.status === 200) {
          lineItems
            .filter(x => x && x?.type === 'art')
            .forEach(item => {
              removeItemFromCollection(item.id, 1);
            });
          // clear out
          clearCart();
          setActiveStep(0);
          setFormFields({});
          setLoad(false);

          const orderNumber = response.data.orderNumber;

          // add item to cart
          addOrderToDatabase({ orderNumber, order: paymentRequestJson });

          history.push(`/checkout/success?orderNumber=${orderNumber}`);
        }
      })
      .catch(function(error) {
        const errorMessage = error?.response?.data?.message || 'Unable to complete order';

        enqueueSnackbar(errorMessage, {
          variant: 'error',
          autoHideDuration: 4500
        });

        setActiveStep(2);
      });

    // on success:
    // setActiveStep(prevActiveStep => prevActiveStep + 1);
    // clearCart();
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
    sqPaymentScript.src = config.SQUARE_URL;
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
              <Typography className={classes.helper}>
                *Shipping will be calculated after this step. Shipping is done via USPS priority
                mail with insurance and signature confirmation required.
              </Typography>
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
            <Grid item xs={12} className={classes.formItem}>
              <FormControl variant="outlined" className={classes.selectFormControl}>
                <InputLabel id="select-country">Country</InputLabel>
                <Select
                  fullWidth
                  labelId="select-country-label"
                  id="select-country"
                  defaultValue={formFields['shippingCountry'] || 'UnitedStates'}
                  onChange={event => {
                    setFormField('shippingCountry', event.target.value);
                  }}
                  label="Country"
                >
                  <MenuItem value="UnitedStates">United States</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem disabled value="">
                    *if you are outside of the US or Canada, please contact Shelby for purchasing
                    options
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
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

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
                <Typography>
                  Please try again or contact shelbykcook.art@gmail.com for assistance.
                </Typography>
              </Grid>
            )}
          </Grid>
        );
      case 2:
        return <Square handleSquare={handleSquare} paymentForm={window.SqPaymentForm} />;
      case 3:
        const shippingStreetAddress = formFields?.shippingStreetAddress2
          ? `${formFields?.shippingStreetAddress} ${formFields?.shippingStreetAddress2}`
          : formFields?.shippingStreetAddress;

        const shippingInternational = formFields?.shippingCountry !== 'UnitedStates';

        return (
          <Grid container>
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
                {shippingInternational ? (
                  <>
                    <br />
                    {formFields?.shippingCountry}
                  </>
                ) : null}
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
  };

  return (
    <Grid container className={classes.root}>
      <AddressModal
        handleClose={handleSelectAddress}
        formFields={formFields}
        recommendedAddress={recommendedAddress}
        open={!!recommendedAddress}
      />

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
                onClick={() => (activeStep > index && !error ? setActiveStep(index) : null)}
              >
                {label}
              </StepLabel>

              <StepContent>
                {getStepContent(index)}
                {activeStep !== 2 && (
                  <div className={classes.actionsContainer}>
                    <Button
                      disabled={!canGoToNextStep || loading}
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        activeStep === steps.length - 1 ? handleCompletePayment() : handleNext()
                      }
                      className={classes.button}
                      fullWidth
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : activeStep === steps.length - 1 ? (
                        'Confirm and Pay'
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </div>
                )}
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
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} sm={6} className={classes.container}>
        <OrderSummary
          onApplyPromo={handleApplyPromo}
          completed={false}
          shipping={formFields?.shippingCost}
          salesTaxRate={formFields?.salesTaxRate}
          shippingCountry={formFields?.shippingCountry}
        />
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
    height: 36,
    position: 'absolute',
    bottom: 6,
    right: 0,
    color: 'gray',

    textTransform: 'capitalize',
    fontSize: 12,
    [theme.breakpoints.down('xs')]: {
      bottom: 10
    }
  },
  selectFormControl: { width: '100%', marginBottom: 15 },
  formItem: {
    paddingLeft: 10,
    paddingRight: 10
  },
  helper: {
    color: theme.palette.text.primary,
    fontSize: 12
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
