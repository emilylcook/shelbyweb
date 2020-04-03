import React from 'react'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

const initialDelay = '600ms'
/*
  delay?: String - Time in ms to delay showing the loader. False shows immediately.
*/
function Progress({ size, delay }) {
  return (
    <Fade
      in={true}
      style={{ transitionDelay: delay === false ? 0 : delay || initialDelay }}
      unmountOnExit
    >
      <CircularProgress disableShrink size={size || 40} />
    </Fade>
  )
}

export default Progress
