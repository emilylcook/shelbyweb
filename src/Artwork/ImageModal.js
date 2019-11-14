import React from 'react'
import { makeStyles } from '@material-ui/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { IconButton, Typography, Dialog, DialogContent, useMediaQuery } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 'none'
  },
  image: {
    maxWidth: '80vw',
    maxHeight: '70vh',
    width: 'auto',
    margin: 'auto',
    height: 'auto'
  },
  button: {
    marginBottom: 30
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.grey[500]
  },
  details: {}
}))

function DialogTitle({ children, onClose }) {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography className={classes.titleRoot}>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  )
}

function ImageModal({ open, handleClose, details: { path, name, info = {} } }) {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog
      fullScreen={fullScreen}
      classes={{ root: classes.root }}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
    >
      <DialogTitle className={classes.title} onClose={handleClose}>
        {/* Request Info */}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <img className={classes.image} alt={name} src={path} />
        <div className={classes.details}>
          <Typography className={classes.title}>{name}</Typography>
          <div className={classes.details}>
            {info.type && <Typography>{info.type}</Typography>}
            {info.size && <Typography>{info.size}</Typography>}
            {info.status && <Typography>{info.status}</Typography>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal
