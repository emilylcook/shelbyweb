import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogContent,
  useMediaQuery,
  Theme
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { useTheme } from '@material-ui/core/styles';

import { addProductToCart } from '../utils/useCartData';

type DialogTitleProps = {
  onClose: () => void;
};

function DialogTitle({ onClose }: DialogTitleProps) {
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
    </MuiDialogTitle>
  );
}

type ImageModalProps = {
  open: boolean;
  collectionId: string;
  handleClose: () => void;
  collection: any;
  details: any;
  commissionPage?: boolean;
};

function ImageModal({
  open,
  collectionId,
  handleClose,
  collection,
  details = {},
  commissionPage
}: ImageModalProps) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [modalDetails, setDetails] = useState(details);
  const { enqueueSnackbar } = useSnackbar();

  const { path, key, name, info = {}, price, quantity = 0 } = modalDetails ?? {};

  useEffect(() => {
    setDetails(details);
  }, [details]);

  function setNext() {
    let nextKey = parseInt(key) + 1;

    if (collection.length <= nextKey) {
      nextKey = 0;
    }

    const nextImage = collection[nextKey];

    setDetails({
      path: nextImage.path,
      key: nextKey,
      name: nextImage.name,
      info: nextImage.info || {},
      quantity: nextImage.quantity || 0,
      price: nextImage?.price,
      id: nextImage.id,
      shippingDetails: nextImage.shippingDetails
    });
  }

  function setPrevious() {
    let prevKey = parseInt(key) - 1;

    if (prevKey < 0) {
      prevKey = collection.length - 1;
    }

    const nextImage = collection[prevKey];

    setDetails({
      shippingDetails: nextImage.shippingDetails,
      path: nextImage.path,
      key: prevKey,
      name: nextImage.name,
      info: nextImage.info || {},
      quantity: nextImage.quantity || 0,
      price: nextImage?.price,
      id: nextImage.id
    });
  }

  function onKeyPress(event: any) {
    if (event.keyCode === 37) {
      // left arrow
      setPrevious();
    } else if (event.keyCode === 39) {
      // right arrow
      setNext();
    }
  }

  const addToCart = () => {
    const item = {
      shippingDetails: modalDetails.shippingDetails,
      id: modalDetails.id,
      collectionId: collectionId,
      quantity: 1,
      price: modalDetails.price,
      name: modalDetails.name,
      path: modalDetails.path,
      info: modalDetails.info
    };

    const result = addProductToCart(item);

    if (result.success) {
      enqueueSnackbar('Added to cart!', {
        variant: 'success',
        autoHideDuration: 4500
      });
    } else {
      enqueueSnackbar('Item already in your cart', {
        variant: 'error',
        autoHideDuration: 4500
      });
    }
  };

  const VALID_QUANTITY = quantity > 0 && price;
  const VALID_SHIPPING_DETAILS =
    modalDetails &&
    modalDetails.shippingDetails &&
    typeof modalDetails.shippingDetails.length === 'number' &&
    typeof modalDetails.shippingDetails.height === 'number' &&
    typeof modalDetails.shippingDetails.width === 'number' &&
    typeof modalDetails.shippingDetails.pounds === 'number' &&
    typeof modalDetails.shippingDetails.ounces === 'number';

  const CAN_ADD_TO_CART = VALID_QUANTITY && VALID_SHIPPING_DETAILS;

  return (
    <Dialog
      fullScreen={fullScreen}
      classes={{ root: classes.root }}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      onKeyDown={onKeyPress}
      BackdropProps={{
        classes: {
          root: classes.backdrop
        }
      }}
      PaperProps={{
        classes: {
          root: classes.elevation
        }
      }}
    >
      {commissionPage ? null : (
        <>
          <IconButton
            aria-label="previous"
            className={classes.backControl}
            onClick={() => setPrevious()}
          >
            <KeyboardArrowLeftIcon className={classes.icon} />
          </IconButton>
          <IconButton aria-label="next" className={classes.nextControl} onClick={() => setNext()}>
            <KeyboardArrowRightIcon className={classes.icon} />
          </IconButton>
        </>
      )}
      <DialogTitle onClose={handleClose}></DialogTitle>
      <DialogContent classes={{ root: classes.contentRoot }}>
        <div>
          <img className={classes.image} alt={name} src={path} />
          <div className={classes.details}>
            <Typography>
              <b>{name}</b>
            </Typography>
            <div className={classes.details}>
              {info.type && <Typography>{info.type}</Typography>}
              {info.size && <Typography>{info.size}</Typography>}
              {commissionPage ? null : (
                <>
                  {info.status && info.status !== 'Available' && (
                    <Typography>{info.status}</Typography>
                  )}
                  {CAN_ADD_TO_CART && (
                    <>
                      <Typography paragraph>${price}</Typography>
                      <Button color="primary" variant="contained" onClick={addToCart}>
                        Add To Cart
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageModal;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 'none'
  },
  elevation: {
    background: 'none',
    boxShadow: 'none',
    height: '100vh',
    width: '100vw',
    maxHeight: '100vh',
    maxWidth: '100vw'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  image: {
    maxWidth: '80vw',
    maxHeight: '70vh',
    width: 'auto',
    margin: 'auto',
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      maxHeight: '60vh'
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: '50vh'
    }
  },
  button: {
    marginBottom: 30
  },
  icon: { fontSize: 80 },
  closeIcon: { fontSize: 40 },
  closeButton: {
    position: 'fixed',
    right: 10,
    top: 10,
    color: 'white',
    zIndex: 1000
  },
  details: {
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  changeSlide: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px',
    borderTop: 'thin solid #d5d5d5',
    height: '99vh'
  },
  backControl: {
    position: 'absolute',
    top: '50%',
    zIndex: 1000,
    left: 0,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      top: '65%'
    }
  },
  nextControl: {
    position: 'absolute',
    zIndex: 1000,
    top: '50%',
    right: 0,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      top: '65%'
    }
  },
  contentRoot: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
