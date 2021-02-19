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
  CircularProgress
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';

import { useTheme } from '@material-ui/core/styles';
import { useForm, FormContext } from 'react-hook-form';

import { collectionInfoFields } from './fields';
import Section from '../common/Section';
import useArtData from '../utils/useCollectionData';

function DialogTitle({ children, onClose }: any) {
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
    </MuiDialogTitle>
  );
}

function EditCollectionModal({ open, art, handleClose }: any) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const { saveCollection } = useArtData();
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: art,
    mode: 'onBlur'
  }); // init

  useEffect(() => {
    methods.reset(art);

    // eslint-disable-next-line
  }, [art]);

  const onSubmit = async (values: any) => {
    setSaving(true);

    const isNew = values.id === '-1';

    const collectionId = isNew ? values.title.replace(/ /g, '') : values.id;

    let item = {
      ...values,
      hidden: values.hidden ? true : false,
      testOnly: values.testOnly ? true : false,
      title: values.title,
      filters: values?.filters?.split(',').map((s: string) => s.trim())
    };

    const updatedCollections = await saveCollection({
      collectionId: collectionId,
      isNew,
      item
    });

    enqueueSnackbar('Updated!', {
      variant: 'success',
      autoHideDuration: 4500
    });

    setSaving(false);
    handleClose(updatedCollections);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      classes={{ root: classes.root }}
      open={open}
      onClose={() => handleClose(null)}
      maxWidth="xl"
      disableBackdropClick
    >
      <DialogTitle className={classes.title} onClose={() => handleClose(null)}></DialogTitle>
      <DialogContent className={classes.content} classes={{ root: classes.contentRoot }}>
        <FormContext {...methods}>
          <form id="edit-art" onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid container>
              <Grid item xs={12}>
                <Section fields={collectionInfoFields} title="Info" />
              </Grid>

              <Grid item xs={12} className={classes.buttonContainer}>
                <Button
                  disabled={saving}
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={() => handleClose(null)}
                  color="default"
                >
                  Cancel
                </Button>
                <Button
                  disabled={saving}
                  className={classes.submitButton}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  {saving ? <CircularProgress size={21} /> : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormContext>
      </DialogContent>
    </Dialog>
  );
}

export default EditCollectionModal;

const useStyles = makeStyles(theme => ({
  contentRoot: {},
  root: {},
  title: {},
  content: {
    // width: 1000
  },
  buttonContainer: {
    textAlign: 'right'
  },
  cancelButton: {
    width: 190,
    marginRight: 20
  },
  submitButton: {
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
