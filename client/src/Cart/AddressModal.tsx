import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  useMediaQuery,
  Button,
  Grid,
  CircularProgress,
  Theme
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';

import { useTheme } from '@material-ui/core/styles';
import { useForm, FormContext } from 'react-hook-form';

import Section from '../common/Section';
import useArtData from '../utils/useCollectionData';

function AddressModal({ open, handleClose, formFields, recommendedAddress }: any) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  if (!recommendedAddress || !open) {
    return null;
  }

  const { address1, address2, city, state, zip5, zip4 } = recommendedAddress;

  return (
    <Dialog
      fullScreen={fullScreen}
      classes={{ root: classes.root }}
      open={open}
      onClose={() => handleClose(null)}
      maxWidth="xl"
      disableBackdropClick
    >
      <DialogContent className={classes.content} classes={{ root: classes.contentRoot }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.title}>
              USPS recommends these changes to your shipping address
            </Typography>
            <Typography className={classes.helper}>
              this will help ensure your package makes it to you.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.column}>
            <Typography className={classes.label}>You entered:</Typography>
            <Typography className={classes.value}>
              {formFields?.shippingFirstName} {formFields?.shippingLastName}
              <br />
              {formFields?.shippingStreetAddress}
              <br />
              {formFields?.shippingStreetAddress2 ? (
                <>
                  {formFields?.shippingStreetAddress2} <br />
                </>
              ) : null}
              {formFields?.shippingCity}, {formFields?.shippingState} {formFields?.shippingPostal}
            </Typography>
            <Button
              className={classes.submitButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={() => handleClose()}
            >
              Use this address
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.column}>
            <Typography className={classes.label}>Recommended Address:</Typography>
            <Typography className={classes.value}>
              {formFields?.shippingFirstName} {formFields?.shippingLastName}
              <br />
              {address1}
              <br />
              {address2 ? (
                <>
                  {address2} <br />
                </>
              ) : null}
              {city}, {state} {zip5}-{zip4}
            </Typography>
            <Button
              className={classes.submitButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={() => handleClose(recommendedAddress)}
            >
              Use this address
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default AddressModal;

const useStyles = makeStyles((theme: Theme) => ({
  contentRoot: {},
  root: {},
  column: {
    textAlign: 'center',

    [theme.breakpoints.down('xs')]: {
      marginBottom: 30,
      marginTop: 30
    }
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: 17
    }
  },

  helper: {
    marginBottom: 20,
    color: theme.palette.text.primary,
    fontSize: 12,
    fontStyle: 'italic',
    letterSpacing: 1
  },
  label: { fontWeight: 600 },
  value: {},
  content: {
    marginBottom: 40,
    width: 800,
    maxWidth: '100%',

    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
      padding: `10px 12px`
    }
  },
  buttonContainer: {
    textAlign: 'right'
  },
  cancelButton: {
    width: 190,
    marginRight: 20
  },
  submitButton: {
    marginTop: 20,
    width: 190
  },

  closeIcon: { fontSize: 20 },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: 'black'
  }
}));
