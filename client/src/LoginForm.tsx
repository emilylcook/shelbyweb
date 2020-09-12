import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Theme
} from '@material-ui/core';
import clsx from 'clsx';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { useHistory } from 'react-router-dom';

import useAuth from './utils/useAuth';

export default function LoginForm() {
  const { logIn, user } = useAuth();
  const history = useHistory();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {
    loginForm,
    loginContainer,
    bottomSpacing,
    loginButton,
    loginDisabledButton,
    title
  } = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      await logIn(username, password);

      const redirect = '/admin/manage';
      history.replace(redirect);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError('Invalid username or password');
    }
  }

  return (
    <div className={loginContainer}>
      <Typography variant="h6" className={clsx(title, bottomSpacing)}>
        Admin Login
      </Typography>
      {user ? (
        <div>Hello {user.email}</div>
      ) : (
        <form className={loginForm} onSubmit={handleLogin}>
          <TextField
            id="username"
            variant="outlined"
            value={username}
            onChange={event => setUsername(event.target.value)}
            label="Username"
            required
            autoFocus
            autoComplete="username"
            className={bottomSpacing}
          />
          <FormControl className={bottomSpacing} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          {error && (
            <Typography variant="subtitle1" color="error" className={bottomSpacing}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className={clsx(bottomSpacing, loginButton, {
              [loginDisabledButton]: !username || !password || loading
            })}
            disabled={!username || !password || loading}
            fullWidth={true}
          >
            Log In
          </Button>
        </form>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 26
  },
  link: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 16,
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  loginContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 66,
    width: 500,
    maxWidth: '100%',
    margin: 'auto'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column'
  },
  bottomSpacing: {
    marginBottom: 20
  },
  loginButton: {
    alignSelf: 'flex-start',
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 20,
    border: `1px solid gray`,
    borderRadius: 8,
    textTransform: 'initial'
  },
  loginDisabledButton: {
    background: 'black'
  }
}));
