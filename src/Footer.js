import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  footer: {
    height: 200,
    backgroundColor: '#e8e8e8'
  }
}))

export default function ButtonAppBar() {
  const classes = useStyles()

  return <div className={classes.footer}></div>
}
