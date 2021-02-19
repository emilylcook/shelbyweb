import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment, Theme } from '@material-ui/core';

import { useFormContext } from 'react-hook-form';

const dotProp = require('dot-prop');

type muSize = 'small' | 'medium' | undefined;
type inputTextFieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  IconComponent?: any;
  validator?: any;

  size?: muSize;
  fullWidth?: boolean;
  transformation?: any;
  autoFocus?: boolean;
  helperText?: string;
  disabled?: boolean;
};

function InputTextField(data: inputTextFieldProps) {
  const classes = useStyles();
  const { register: formRegister, errors, setValue, getValues } = useFormContext();

  const {
    IconComponent,
    label,
    name,
    placeholder,
    validator,
    size,
    fullWidth = true,
    type = 'text',
    transformation = {},
    autoFocus = false,
    helperText,
    disabled
  } = data;

  const register: any = formRegister;

  const options = validator || {};

  const error = dotProp.get(errors, name);
  let errorMessage: string | null = null;
  if (error) {
    switch (error) {
      case 'pattern':
        errorMessage = `Invalid ${label}`;
        break;
      case 'required':
        errorMessage = `${label} is required`;
        break;
      case 'maxLength':
        errorMessage = `${label} max length is ${validator.maxLength}`;
        break;
      default:
        errorMessage = `${label} is invalid`;
        break;
    }
  }

  const values = getValues();

  const started = values[name];

  function handleChange(e: any) {
    let value = e.target.value;
    if (transformation.capitalize) {
      value = value ? value[0].toUpperCase() + value.substr(1) : '';
    }
    setValue(name, value);
  }

  return (
    <div className={classes.textField}>
      <TextField
        autoFocus={autoFocus}
        id={name}
        type={type}
        inputRef={register(options)}
        label={options.required ? `${label} (*)` : label}
        placeholder={placeholder || label}
        name={name}
        margin="normal"
        fullWidth={fullWidth}
        color="secondary"
        variant="outlined"
        InputProps={
          IconComponent && {
            startAdornment: (
              <InputAdornment position="start">
                <IconComponent className={classes.icon} />
              </InputAdornment>
            )
          }
        }
        {...(started ? { InputLabelProps: { shrink: true } } : {})}
        error={!!error}
        helperText={errorMessage || helperText}
        size={size}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: 'gray'
  }
}));

export default InputTextField;
