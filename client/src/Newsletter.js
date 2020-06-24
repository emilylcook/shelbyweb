import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { Button, Grid, Typography, TextField } from '@material-ui/core'

import config from './config'

const Newsletter = () => {
  const classes = useStyles()
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [message, setMessage] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  function subscribe() {
    setLoading(true)
    axios
      .post(`${config.API}/signup`, {
        email
      })
      .then(function(response) {
        setMessage(response.data.message)
        setSubscribed(true)
        setLoading(false)
      })
      .catch(function(error) {
        setSubscribed('error')
        setLoading(false)
      })
  }

  useEffect(() => {
    if (subscribed === true) {
      enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 4500
      })

      setSubscribed(false)
    } else if (subscribed === 'error') {
      enqueueSnackbar('Unable to sign up to newsletter', {
        variant: 'error',
        autoHideDuration: 4500
      })
      setSubscribed(false)
    }
  }, [subscribed, enqueueSnackbar, message])

  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}/

  return (
    <div className={classes.newsLetterContainer}>
      <Grid container className={classes.newsletter}>
        <Grid item xs={12} className={classes.newsletterHeader}>
          <Typography variant="h5">Join the Collector's List!</Typography>
          <Typography paragraph>
            Sign up to receive VIP exclusive discounts and first access to collection releases.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.form}>
          <TextField
            className={classes.textfield}
            InputProps={{
              className: classes.textfield
            }}
            variant="outlined"
            label="Email"
            placeholder="enter your email"
            margin="dense"
            onChange={event => {
              setEmail(event.target.value)
            }}
          ></TextField>

          <Button
            disabled={!emailRegex.test(email) || loading}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={subscribe}
          >
            Subscribe
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph className={classes.footer}>
            We promise to never spam you!
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default Newsletter

const useStyles = makeStyles(theme => ({
  newsLetterContainer: {
    padding: 40,
    marginTop: 50,
    backgroundColor: '#dddddd',
    [theme.breakpoints.down('xs')]: {
      padding: '40px 20px'
    }
  },
  newsletter: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center'
  },
  newsletterHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  button: {
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: 600,
    letterSpacing: 2,
    height: 38,
    [theme.breakpoints.down('xs')]: {
      marginTop: 5,
      width: '100%'
    }
  },
  form: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  textfield: {
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  footer: {
    fontStyle: 'italic',
    fontSize: '.8rem',
    letterSpacing: 1,
    opacity: 0.8,
    marginTop: 10
  }
}))
