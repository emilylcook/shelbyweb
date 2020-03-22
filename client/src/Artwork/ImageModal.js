import React, { useState, useEffect } from 'react'
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
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      maxHeight: '60vh'
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: '50vh'
    }
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
  details: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  changeSlide: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px',
    borderTop: 'thin solid #d5d5d5'
  },
  slideControl: {
    fontSize: 10
  }
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

function ImageModal({ open, handleClose, collection, details = {} }) {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [modalDetais, setDetails] = useState(details)

  const { path, key, name, info = {} } = modalDetais

  useEffect(() => {
    setDetails(details)
  }, [details])

  function setNext() {
    let nextKey = parseInt(key) + 1

    if (collection.length <= nextKey) {
      nextKey = 0
    }

    const nextImage = collection[nextKey]

    setDetails({
      path: nextImage.path,
      key: nextKey,
      name: nextImage.name,
      info: nextImage.info || {}
    })
  }

  function setPrevious() {
    let prevKey = parseInt(key) - 1

    if (prevKey < 0) {
      prevKey = collection.length - 1
    }

    const nextImage = collection[prevKey]

    setDetails({
      path: nextImage.path,
      key: prevKey,
      name: nextImage.name,
      info: nextImage.info || {}
    })
  }

  function onKeyPress(event) {
    if (event.keyCode === 37) {
      // left arrow
      setPrevious()
    } else if (event.keyCode === 39) {
      // right arrow
      setNext()
    }
  }
  return (
    <Dialog
      fullScreen={fullScreen}
      classes={{ root: classes.root }}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      onKeyDown={onKeyPress}
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
      <div className={classes.changeSlide}>
        <Typography className={classes.slideControl} onClick={() => setPrevious()}>
          {'<'} previous
        </Typography>
        <Typography className={classes.slideControl} onClick={() => setNext()}>
          next {'>'}
        </Typography>
      </div>
    </Dialog>
  )
}

export default ImageModal
