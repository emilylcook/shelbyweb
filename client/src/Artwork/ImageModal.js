import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { IconButton, Typography, Dialog, DialogContent, useMediaQuery } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import { useTheme } from '@material-ui/core/styles'

function DialogTitle({ children, onClose }) {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography className={classes.titleRoot}>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon className={classes.closeIcon} />
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
      classes={{ root: classes.root, elevation: classes.elevation }}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      onKeyDown={onKeyPress}
      BackdropProps={{
        classes: {
          root: classes.backdrop
        }
      }}
      PaperProps={{
        classes: {
          root: classes.elevation
        }
      }}
    >
      <IconButton
        aria-label="previous"
        className={classes.backControl}
        onClick={() => setPrevious()}
      >
        <KeyboardArrowLeftIcon className={classes.icon} />
      </IconButton>
      <IconButton aria-label="mext" className={classes.nextControl} onClick={() => setNext()}>
        <KeyboardArrowRightIcon className={classes.icon} />
      </IconButton>
      <DialogTitle className={classes.title} onClose={handleClose}></DialogTitle>
      <DialogContent className={classes.content} classes={{ root: classes.contentRoot }}>
        <div>
          <img className={classes.image} alt={name} src={path} />
          <div className={classes.details}>
            <Typography className={classes.title}>
              <b>{name}</b>
            </Typography>
            <div className={classes.details}>
              {info.type && <Typography>{info.type}</Typography>}
              {info.size && <Typography>{info.size}</Typography>}
              {info.status && <Typography>{info.status}</Typography>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 'none'
  },
  elevation: {
    background: 'none',
    boxShadow: 'none',
    height: '100vh',
    width: '100vw',
    maxHeight: '100vh',
    maxWidth: '100vw'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
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
  icon: { fontSize: 80 },
  closeIcon: { fontSize: 40 },
  closeButton: {
    position: 'fixed',
    right: 10,
    top: 10,
    color: 'white'
  },
  details: {
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  changeSlide: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px',
    borderTop: 'thin solid #d5d5d5',
    height: '99vh'
  },

  backControl: {
    position: 'absolute',
    top: '50%',
    left: 0,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      top: '65%'
    }
  },

  nextControl: {
    position: 'absolute',
    top: '50%',
    right: 0,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      top: '65%'
    }
  },
  contentRoot: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))
