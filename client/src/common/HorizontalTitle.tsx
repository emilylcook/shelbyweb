import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Theme, Typography } from '@material-ui/core';

export type HorizontalTitleProps = {
  title: string;
  includeSpacer?: boolean;
  titleClass?: any;
};

const HorizontalTitle = ({ title, includeSpacer, titleClass = null }: HorizontalTitleProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.horizontalTitleContainer, { [classes.spacer]: includeSpacer })}>
      <Typography className={classes.horizontalLine}>
        <span className={clsx(classes.horizontalTitle, titleClass)}>{title}</span>
      </Typography>
    </div>
  );
};

export default HorizontalTitle;

const useStyles = makeStyles((theme: Theme) => ({
  horizontalTitleContainer: {
    position: 'relative',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  horizontalLine: {
    '&:before': {
      zIndex: -1,
      position: 'absolute',
      top: '50%',
      left: '10%',
      width: '80%',
      height: 1,
      backgroundColor: '#272f28',
      content: "''"
    }
  },
  horizontalTitle: {
    display: 'inlineBlock',
    padding: '0 6px 0 10px',
    backgroundColor: theme.palette.background.default,
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingLeft: 20,
    paddingRight: 20
  },
  spacer: {
    marginBottom: 20
  }
}));
