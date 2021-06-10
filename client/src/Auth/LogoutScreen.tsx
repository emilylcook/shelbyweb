import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import useAuth from '../utils/useAuth';

export default function LogOutScreen() {
  const history = useHistory();
  const { logOut } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const queryString = window.location.search;

  React.useEffect(() => {
    async function startLogout() {
      try {
        setLoading(true);
        await logOut();
        setLoading(false);
        history.replace(`/`);
      } catch (e) {
        setLoading(false);
        setError('Something went wrong. Please refresh the page.');
      }
    }
    startLogout();
  }, [history, logOut, queryString]);
  return (
    <div>
      {loading ? 'Logging out...' : 'You are now logged out of your account'}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
}
