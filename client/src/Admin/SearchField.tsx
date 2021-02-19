import React from 'react';
import { TextField, InputAdornment, makeStyles, Theme } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export default function SearchField({ onChange }: any) {
  const [value, setValue] = React.useState('');
  const classes = useStyles();

  const memoizedCallback = React.useCallback(
    value => {
      onChange(value);
    },
    [onChange]
  );

  // create a small delay on search for more of a 'when user stops typing'
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      memoizedCallback(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, memoizedCallback]);

  return (
    <div className={classes.wrapper}>
      <TextField
        fullWidth={true}
        variant="outlined"
        id="Search"
        name="Search"
        label="Search"
        value={value}
        onChange={e => setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </div>
  );
}
const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 400
    },
    [theme.breakpoints.down('xs')]: {
      width: 250
    }
  }
}));
