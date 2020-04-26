import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Typography, Grid, Button } from '@material-ui/core'
import clsx from 'clsx'
import axios from 'axios'
import { useFormState } from 'react-use-form-state'
import { useSnackbar } from 'notistack'

import WidthContainer from './WidthContainer'
import { HorizontalTitle } from './common/'
import { isFormSubmitDisabled } from './utils'
import config from './config'

import Hero from './Hero'
import heroImg from './assets/hero/Tofino3.jpg'

const Commissions = () => {
  const classes = useStyles()

  const [formState, { text, email }] = useFormState({})
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const inputs = {
    name: {
      gridWidth: { xs: 12 },
      name: 'name',
      label: 'Name *',
      inputType: text,
      variant: 'outlined',
      validator: {
        required: true
      }
    },
    email: {
      gridWidth: { xs: 12 },
      name: 'email',
      label: 'Email *',
      inputType: email,
      variant: 'outlined',
      validator: {
        required: true
      }
    },
    paintingSize: {
      gridWidth: { xs: 12 },
      name: 'paintingSize',
      label: 'Desired Painting Size *',
      inputType: text,
      variant: 'outlined',
      validator: {
        required: true
      }
    },
    inspiration: {
      gridWidth: { xs: 12 },
      name: 'inspiration',
      label: 'Inspiration *',
      inputType: text,
      variant: 'outlined',
      multiline: true,
      rows: 4,
      rowsMax: 12,
      validator: {
        required: true
      }
    },
    questions: {
      gridWidth: { xs: 12 },
      name: 'questions',
      label: 'Questions?',
      inputType: text,
      variant: 'outlined',
      multiline: true,
      rows: 4,
      rowsMax: 12,
      validator: {
        required: false
      }
    }
  }

  useEffect(() => {
    const touchedForm = Object.keys(formState.touched).some(name => {
      return formState.touched[name]
    })

    if (emailSent && touchedForm) {
      formState.reset()

      enqueueSnackbar('Request Sent', {
        variant: 'success',
        autoHideDuration: 4500
      })

      setEmailSent(false)
    }
  }, [emailSent, formState, enqueueSnackbar])

  const disableSubmit = isFormSubmitDisabled(inputs, formState)

  function sendEmail() {
    const { name, email, paintingSize, inspiration, questions } = formState.values
    setLoading(true)
    axios
      .post(`${config.API}/sendEmail`, {
        name,
        email,
        paintingSize,
        inspiration,
        questions
      })
      .then(function(response) {
        setEmailSent(true)
        setLoading(false)
      })
      .catch(function(error) {
        setEmailSent(false)
        setLoading(false)
      })
  }

  return (
    <div className={classes.content}>
      <Hero heroImg={heroImg} />
      <WidthContainer className={classes.columnWrapper}>
        <Grid container>
          <Grid item xs={12} className={clsx(classes.header)}>
            <HorizontalTitle title="Commissions" titleClass={classes.horizontalTitle} />
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography paragraph>
              I am happy to work with you to create a custom painting to fit your space. I can do
              landscapes, portraits, or pet portrait commissions. Along with the desired size and
              subject matter, I appreciate any and all inspiration you can provide –
              photographs/images/locations that you would like me to work from, color schemes, etc.
              If you have any particular paintings or styles of mine that you favor, include that
              information too!
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Inspiration
            </Typography>

            <Typography paragraph>
              Once you have communicated your interest, we can discuss sizing, pricing, and
              composition. I will create some quick thumbnail sketches so you can decide on
              composition and orientation.
            </Typography>
            <Typography paragraph>
              As soon as we have settled on a composition/color scheme and the deposit has been
              paid, I start with a small color study, usually around 5” x 7”, to get approval on the
              composition and color scheme before starting the final piece (this color study becomes
              a bonus for you and will be shipped with the completed painting!)
            </Typography>
            <Typography paragraph>
              At this point, I typically allow for 10-12 weeks for completion of each piece,
              depending on complexity and other projects at the time.
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Pricing
            </Typography>
            <Typography paragraph>
              At this time, my prices for commissioned pieces start at around $500 for a 16” x 20”
              painting. This is to account for the time spent putting together a cohesive piece that
              meets all of your wishes. I ask for a 50% deposit to begin, with the remaining
              balance, plus shipping, due once your painting is complete.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h4" className={classes.getStarted}>
              To get started on your custom piece, complete the form below.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.section}>
            <Typography paragraph className={classes.inquiries}>
              Serious inquiries only, please
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} className={classes.form}>
            <Grid container>
              {Object.entries(inputs).map(([index, { gridWidth, name, inputType, ...rest }]) => (
                <Grid key={index} item {...gridWidth} className={classes.field}>
                  <TextField
                    {...inputType({
                      name,
                      validateOnBlur: true
                    })}
                    name={name}
                    fullWidth
                    {...rest}
                    error={formState.errors[name] ? true : false}
                    helperText={formState.errors[name]}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Typography paragraph className={classes.inquiries}>
                  * designates a required field
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.submitButton}>
                <Button
                  disabled={disableSubmit || loading}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={sendEmail}
                >
                  Send Request
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </WidthContainer>
    </div>
  )
}

export default Commissions

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  submitButton: {
    marginBottom: 50
  },
  field: { marginBottom: 20 },
  subTitle: {
    marginBottom: '15px'
  },
  horizontalTitle: {
    fontSize: '2rem'
  },
  header: {
    marginTop: 40,
    marginBottom: 50
  },
  section: {
    marginBottom: 20
  },
  title: {
    marginBottom: 20,
    fontWeight: 500,
    letterSpacing: 2,
    fontVariant: 'small-caps'
  },
  getStarted: {
    fontStyle: 'italic',
    fontSize: '1rem',
    fontWeight: 500
  },
  inquiries: {
    fontStyle: 'italic',
    fontSize: '.8rem',
    letterSpacing: 1,
    opacity: 0.8
  }
}))
