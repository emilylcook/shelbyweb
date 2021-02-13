import React, { useState } from 'react';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { HashLink as Link } from 'react-router-hash-link';

import { useHistory } from 'react-router';

import { getItemsInCart, removeItemFromCart } from '../utils/useCartData';
import { confirmItemIsAvailable } from '../utils/useCollectionData';

const FREE_SHIPPING_CODE = 'VIPSHIPPING2021';

export default function OrderSummary({
  completed = false,
  cartView = false,
  shipping = null,
  salesTaxRate = null,
  onApplyPromo = null,
  shippingCountry = 'UnitedStates'
}) {
  const classes = useStyles({});
  const history = useHistory();

  const [itemsInCart, setItemsInCart] = useState(getItemsInCart() || []);
  const { enqueueSnackbar } = useSnackbar();

  const [promoCodeEntry, setPromoCodeEntry] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const [freeShipping, setFreeShipping] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const handleApplyPromo = () => {
    if (promoCodeEntry === FREE_SHIPPING_CODE) {
      setFreeShipping(true);
      setPromoError(false);
    } else {
      setFreeShipping(false);
      setPromoError(true);
    }

    setPromoCode(promoCodeEntry);
  };

  React.useEffect(() => {
    if (onApplyPromo) {
      if (freeShipping) {
        const discount = shippingCountry === 'UnitedStates' ? shipping : 10;

        console.log(shippingCountry);
        onApplyPromo({ code: promoCode, discount });
      } else {
        onApplyPromo(null);
      }
    }
    // eslint-disable-next-line
  }, [shipping, freeShipping, shippingCountry]);

  const verifyItemsInCart = async () => {
    if (itemsInCart && itemsInCart.length > 0) {
      itemsInCart.forEach(async x => {
        const availableInDatabase = await confirmItemIsAvailable(x.collectionId, x.id);

        if (!availableInDatabase) {
          // if item is not available, remove it

          removeItem(x.id, false);
          enqueueSnackbar(`${x.name} is no longer available`, {
            variant: 'error',
            autoHideDuration: 4500
          });
        }
      });
    }
  };

  verifyItemsInCart();

  if (!cartView && itemsInCart.length === 0) {
    setTimeout(function() {
      history.push('/cart');
    }, 4500);
  }

  const removeItem = async (id, showMessage = true) => {
    const result = await removeItemFromCart(id);

    if (result) {
      const modifiedItems = [...itemsInCart];
      const itemToRemove = modifiedItems.findIndex(x => x.id === id);
      modifiedItems.splice(itemToRemove, 1);

      setItemsInCart(modifiedItems);

      if (showMessage) {
        enqueueSnackbar('Removed item from cart!', {
          variant: 'success',
          autoHideDuration: 4500
        });
      }
    } else {
      if (showMessage) {
        enqueueSnackbar('Unable to remove item', {
          variant: 'error',
          autoHideDuration: 4500
        });
      }
    }
  };

  const pricesInCart = itemsInCart?.flatMap(x => x.price);
  let subTotal = pricesInCart
    .reduce(function(a, b) {
      return a + b;
    }, 0)
    .toFixed(2);

  let taxes = salesTaxRate ? (subTotal * salesTaxRate).toFixed(2) : null;
  // let shipping = null;
  let totalAmount = parseFloat(subTotal);

  if (shipping && !freeShipping) {
    totalAmount += parseFloat(shipping);
  } else if (shipping && shippingCountry !== 'UnitedStates') {
    const discountedShipping = parseFloat(shipping) - 10;
    totalAmount += discountedShipping;
  }
  if (taxes) {
    totalAmount += parseFloat(taxes);
    totalAmount = totalAmount.toFixed(2);
  }

  const emptyCart = !itemsInCart || itemsInCart.length === 0;
  return (
    <Grid container className={classes.orderSummary}>
      <Grid item xs={12}>
        <Typography variant="h3" paragraph className={classes.h3}>
          Order Summary
        </Typography>
      </Grid>

      {emptyCart ? (
        <Typography className={classes.info}>There is nothing in your cart!</Typography>
      ) : (
        <>
          {itemsInCart.map(item => {
            const { id, name, path, info, price, quantity } = item;

            const details = `${info.size} - ${info.type}`;
            return (
              <Grid key={id} item xs={12} className={classes.lineContainer}>
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
                {!completed && (
                  <Button
                    className={classes.removeButton}
                    variant="outlined"
                    color="default"
                    onClick={() => removeItem(id)}
                  >
                    Remove
                  </Button>
                )}
              </Grid>
            );
          })}

          <Grid item xs={12}>
            {cartView ? null : (
              <Grid container>
                <Grid item xs={12} className={classes.promoCodeContainer}>
                  <TextField
                    className={classes.promoCodeTextfield}
                    variant="outlined"
                    label="Promo Code"
                    placeholder="code"
                    size="small"
                    dense={true}
                    onChange={event => {
                      const text = event.target.value.toUpperCase();
                      setPromoCodeEntry(text);
                    }}
                    defaultValue={''}
                    fullWidth
                  ></TextField>
                  <Button
                    onClick={handleApplyPromo}
                    color="primary"
                    variant="contained"
                    className={classes.promoCodeApply}
                  >
                    Apply
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {freeShipping ? (
                    <Typography className={classes.promoSuccess}>
                      Promo applied at shipping
                    </Typography>
                  ) : null}
                  {promoError ? (
                    <Typography className={classes.errorMessage} color="error">
                      Promo not valid
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} className={classes.costInfoContainer}>
            <div className={classes.row}>
              <Typography className={classes.costLabel}>SubTotal</Typography>
              <Typography className={classes.dollarAmount}>${subTotal} USD</Typography>
            </div>

            {!cartView && (
              <>
                <div className={classes.row}>
                  <Typography className={classes.costLabel}>Tax</Typography>
                  <Typography className={classes.dollarAmount}>
                    {taxes ? `$${taxes} USD` : '-'}
                  </Typography>
                </div>

                <div className={classes.row}>
                  <Typography className={classes.costLabel}>Shipping</Typography>
                  {shipping >= 10000 ? (
                    <Typography color="Error" className={classes.dollarAmount}>
                      Error
                    </Typography>
                  ) : (
                    <Typography className={classes.dollarAmount}>
                      {shipping ? `$${shipping} USD` : '-'}
                    </Typography>
                  )}
                </div>
                {freeShipping ? (
                  <div className={classes.row}>
                    <Typography className={classes.costLabel}>Promo</Typography>
                    <Typography className={classes.dollarAmount}>
                      -${shippingCountry === 'shippingCountry' ? shipping : 10} USD
                    </Typography>
                  </div>
                ) : null}
                <div className={classes.totalRow}>
                  <Typography className={classes.totalLabel}>Total</Typography>
                  {shipping >= 10000 ? (
                    <Typography color="Error" className={classes.dollarAmount}>
                      Error
                    </Typography>
                  ) : (
                    <Typography className={classes.totalPrice}>${totalAmount} USD</Typography>
                  )}
                </div>
              </>
            )}
          </Grid>

          {cartView && (
            <Grid item xs={12} className={classes.checkoutButtonContainer}>
              <Link to={'/checkout'} className={classes.link}>
                <Button color="primary" variant="contained" className={classes.cButton}>
                  Checkout
                </Button>
              </Link>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  promoSuccess: {
    marginTop: 5,
    color: 'green'
  },
  errorMessage: {
    marginTop: 5
  },
  promoCodeContainer: {
    alignItems: 'flex-end',
    display: 'flex'
  },
  promoCodeApply: {
    marginLeft: 15,
    height: 39
  },
  checkoutButtonContainer: {
    marginTop: 20,
    textAlign: 'right'
  },
  cButton: {
    width: 150
  },
  link: {
    textDecoration: 'none !important'
  },
  orderSummary: {
    height: 'fit-content'
  },
  label: {
    fontWeight: 600
  },
  reviewRow: { marginBottom: 10 },
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
  quantity: { fontColor: 'gray', fontSize: 12, height: 35 },
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
  promoCodeTextfield: { flex: 1 },
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
