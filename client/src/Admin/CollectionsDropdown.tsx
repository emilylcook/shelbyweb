import React, { useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useFormContext } from 'react-hook-form';

import Select from '@material-ui/core/Select';
import { MenuItem, FormControl, InputLabel, FormHelperText, Theme } from '@material-ui/core';
import useArtData from '../utils/useCollectionData';

const dotProp = require('dot-prop');

type DropdownFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  validator?: any;

  disabled?: boolean;
  handleChange?: any;
  default?: any;
};

function CollectionsDropdown(data: DropdownFieldProps) {
  const classes = useStyles();

  const myRef = useRef<HTMLInputElement>(null);
  const { label, name, validator, disabled, handleChange, default: defaultValue } = data;

  const { watch, register, setValue, errors, formState } = useFormContext();
  const value = watch(name);

  const { loading, collections } = useArtData();

  let errorMessage = null;
  const touched = dotProp.get(formState.touched, name);
  if (validator?.required && touched && !value) {
    errorMessage = `${label} is required`;
  }

  const error = dotProp.get(errors, name);

  if (error && !value) {
    if (error.type === 'required') {
      errorMessage = `${label} is required`;
    }
  }

  const handleMUIChange = (event: any) => {
    const val = event.target.value;
    setValue(name, val);
    handleChange && handleChange(val);
  };

  React.useEffect(() => {
    register({ name }, validator); // custom register react-select

    if (defaultValue) {
      setValue(name, defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, name]);

  if (loading) {
    return null;
  }

  const displayLabel = validator?.required ? `${label} (*required)` : label;
  return (
    <div className={classes.dropdown} ref={myRef}>
      <FormControl variant="outlined" className={classes.formControl} error={!!errorMessage}>
        <InputLabel id="select-outlined-label">{displayLabel}</InputLabel>
        <Select
          label={displayLabel}
          labelId="select-outlined-label"
          id="select-outlined"
          name={name}
          value={value || defaultValue || ''}
          onChange={handleMUIChange}
          onOpen={() => setValue(name, value)}
          disabled={disabled}
        >
          {collections.map((c: any, i: number) => {
            return (
              <MenuItem key={i} value={c.id}>
                {c.id}
              </MenuItem>
            );
          })}
        </Select>
        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  dropdown: {
    paddingTop: 16
  },
  icon: {
    color: 'gray'
  },
  formControl: {
    minWidth: '100%'
  }
}));

export default CollectionsDropdown;
