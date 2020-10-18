import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core';

import { Controller, useFormContext } from 'react-hook-form';

type checkboxFieldProps = {
  name: string;
  label: any;
  onClick?: any;
  formControlClass?: any;
  disabled?: boolean;
};

function CheckboxField(data: checkboxFieldProps) {
  const { label, name, onClick, formControlClass, disabled } = data;
  const { control, register } = useFormContext();
  const classes = useStyles();

  return (
    <FormControlLabel
      id={name}
      label={label}
      className={formControlClass}
      classes={{ label: classes.checkbox }}
      control={
        <Controller
          defaultValue={false}
          disabled={disabled}
          as={
            <Checkbox
              inputRef={register}
              name={name}
              color="primary"
              onClick={event => (onClick ? onClick(event) : undefined)}
            />
          }
          control={control}
          name={name}
        />
      }
    />
  );
}

const useStyles = makeStyles(() => ({
  checkbox: {
    fontSize: 18
  }
}));

export default CheckboxField;
