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

const Commissions = () => {
  const classes = useStyles()

  const [formState, { text, email }] = useFormState({})
  const [emailSent, setEmailSent] = useState(false)
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
      })
      .catch(function(error) {
        setEmailSent(false)
      })
  }

  return (
    <div className={classes.content}>
      <WidthContainer className={classes.columnWrapper}>
        <Grid container>
          <Grid item xs={12} className={clsx(classes.header)}>
            <HorizontalTitle title="The Commission Process" titleClass={classes.horizontalTitle} />
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Size
            </Typography>
            <Typography paragraph>
              First thing is to decide the best size canvas for your custom project. At this time I
              am only accepting commissions 24" x 30" and larger. If you are unsure the perfect size
              for your space, I’m happy to help you decide!
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Inspiration
            </Typography>

            <Typography paragraph>
              It can help for me to see your space, either through photos or in person (if local),
              to get a feel for the surrounding atmosphere (wall color, fabric swatches, light,
              overall mood, etc.)
            </Typography>
            <Typography paragraph>
              I appreciate any inspiration you can provide - what particular paintings/style of mine
              you favor, any photographs/landscapes/locations you would like me to work from,
              Pinterest boards, color palettes, etc. The more insight, the better!
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Sketch
            </Typography>

            <Typography paragraph>
              I start with a few watercolor sketch options for your piece, to give you an idea of
              what I had in mind and make sure we are on the same page. Once I have your approval,
              the oil painting begins. At this point, I typically allow for 10-12 week for
              completion of each piece (and slightly longer during the holiday season.)
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h5" className={classes.title}>
              Pricing
            </Typography>

            <Typography paragraph>
              My prices for commissioned pieces start at about $1200, and run about 15% more than
              ready-to-ship paintings. This is to account for the time spent putting together a
              cohesive piece that meets all of your wishes. I ask for a 50% deposit to begin, with
              the remaining balance, plus shipping, due once your painting is complete.
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
                  disabled={disableSubmit}
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
