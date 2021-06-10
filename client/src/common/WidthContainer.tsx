import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import clsx from 'clsx';

export type WidthContainerProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: any;
  [x: string]: any;
};

const WidthContainer = ({
  children,
  fullWidth,
  className: classNameProp,
  ...rest
}: WidthContainerProps) => {
  const classes = useStyles();

  let className = clsx(classes.container, classNameProp);
  if (!fullWidth) {
    className = clsx(classes.container, classNameProp, classes.mobilePadding);
  }
  return (
    <Grid className={classes.root} container>
      <Grid className={className} {...rest}>
        {children}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    [theme.breakpoints.down('lg')]: {
      width: '960px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '1080px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mobilePadding: {
    [theme.breakpoints.down('sm')]: {
      padding: '0px 5px'
    }
  }
}));

export default WidthContainer;
