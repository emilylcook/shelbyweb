import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import clsx from 'clsx'

import { HorizontalTitle } from '../common/'
import WidthContainer from '../WidthContainer'
import ImageModal from './ImageModal'

import getCollection from './collections'

const Artwork = ({ match }) => {
  const classes = useStyles()
  const [hoverOn, setHoverOn] = useState(null)
  const theme = useTheme()

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageModalDetails, setImageModalDetails] = useState({})
  const [selectedFilters, setSelectedFilters] = useState(new Set())
  const [hideArtwork, setHideArtwork] = useState(true)
  const { collection, title } = getCollection(match.params.collection)

  const hideModal = useMediaQuery(theme.breakpoints.down('xs'))

  useEffect(() => {
    setHideArtwork(true)
    setTimeout(function() {
      setHideArtwork(false)
      setSelectedFilters(new Set())
    }, 100)
  }, [match])

  function handleFilter(filter) {
    const selected = selectedFilters.has(filter)
    let newSet = selectedFilters

    if (selected) {
      newSet.delete(filter)
    } else {
      newSet.add(filter)
    }

    setSelectedFilters(new Set(newSet))
  }

  function clearFilters() {
    setSelectedFilters(new Set())
  }

  const { filters } = collection
  let art = collection.art

  function filteredArt(art) {
    return art.filter(a => {
      // must contain all set
      const array = [...selectedFilters]
      return array.every(f => a.tags.includes(f))
    })
  }

  art = selectedFilters.size > 0 ? filteredArt(art) : art

  return (
    <>
      <div className={classes.content}>
        <WidthContainer className={classes.mainContent}>
          <div className={classes.titleSection}>
            <HorizontalTitle title={title} includeSpacer titleClass={classes.pageTitle} />
          </div>
          {filters && (
            <div className={classes.filterSection}>
              <div
                className={clsx(classes.filter, {
                  [classes.activeFilter]: selectedFilters.size === 0
                })}
                onClick={() => clearFilters()}
              >
                All
              </div>
              {filters.map(filter => {
                const isActive = selectedFilters.has(filter.toLowerCase())

                return (
                  <div
                    key={filter}
                    className={clsx(classes.filter, { [classes.activeFilter]: isActive })}
                    onClick={() => handleFilter(filter.toLowerCase())}
                  >
                    {filter}
                  </div>
                )
              })}
            </div>
          )}
          <div className={clsx(classes.masonaryContainer, { [classes.hidden]: hideArtwork })}>
            {Object.entries(art).map(([key, { path, name, info }]) => {
              const isHovered = hoverOn === key
              return (
                <div
                  key={key}
                  className={clsx(classes.tile, { [classes.tileHover]: isHovered })}
                  onMouseEnter={() => setHoverOn(key)}
                  onClick={() => {
                    if (hideModal) {
                      setHoverOn(key)
                    } else {
                      setImageModalDetails({ path, key, name, info })
                      setImageModalOpen(true)
                    }
                  }}
                  onMouseLeave={() => setHoverOn(null)}
                >
                  <img className={classes.masonaryItem} alt={name} src={path} />
                  <div className={classes.details}>
                    <Typography
                      className={clsx(classes.paragraph, classes.title, {
                        [classes.paragraphHover]: isHovered
                      })}
                    >
                      {name}
                    </Typography>
                    <div
                      className={clsx(classes.paragraph, classes.info, {
                        [classes.paragraphHover]: isHovered
                      })}
                    >
                      {info.type && <Typography>{info.type}</Typography>}
                      {info.size && <Typography>{info.size}</Typography>}
                      {info.status && <Typography>{info.status}</Typography>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* <Grid container className={classes.container}></Grid> */}
        </WidthContainer>
      </div>
      <ImageModal
        handleClose={() => {
          setImageModalOpen(false)
          setImageModalDetails({})
        }}
        collection={art}
        details={imageModalDetails}
        open={imageModalOpen}
      />
    </>
  )
}

export default Artwork

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'center'
  },
  filter: {
    // width: 100,
    margin: '0px 10px',
    fontSize: 17,
    letterSpacing: 1,
    fontVariant: 'small-caps',
    cursor: 'pointer'
  },
  activeFilter: {
    fontWeight: 600
  },
  masonaryContainer: {
    columns: '3 300px',
    columnGap: '1rem',
    marginTop: 40,
    [theme.breakpoints.down('xs')]: {
      marginTop: 10
    }
  },
  masonaryItem: {
    color: 'white',
    display: 'block',
    width: '100%'
  },
  tile: {
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 1rem 1rem 0',
    textAlign: 'left',
    opacity: 0.99,
    borderRadius: 3,
    // boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
    [theme.breakpoints.down('xs')]: {
      margin: 10
    },
    '&:before': {
      content: "''",
      background: 'linear-gradient(to bottom,rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
      width: '100%',
      height: '60%',
      opacity: 0,
      position: 'absolute',
      top: '50%', // must match the margin below
      left: 0,
      zIndex: 2,
      transitionProperty: 'top, opacity',
      transitionDuration: '.4s'
    }
  },
  tileHover: {
    '&:before': {
      opacity: 1
    }
  },
  hidden: {
    display: 'none'
  },
  details: {
    fontSize: 16,
    padding: 20,
    color: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 3
  },
  paragraph: {
    display: 'block',
    opacity: 1,
    position: 'relative',
    top: 120,
    transitionProperty: 'top, opacity',
    transitionDuration: '.4s',
    transitionDelay: '0s'
  },
  paragraphHover: {
    top: 0
  },
  title: {
    lineHeight: 1,
    fontWeight: 600,
    fontSize: 18,
    transitionDelay: '0.15s'
  },
  info: {
    lineHeight: 1.2,
    marginTop: 5,
    fontSize: 12,
    transitionDelay: '0.4s'
  },
  content: {
    marginTop: 50,
    marginBottom: 100,
    [theme.breakpoints.down('sm')]: {
      marginTop: 45
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 30
    }
  },
  pageTitle: {
    fontSize: 25
  },
  titleSection: {
    marginBottom: 10,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0
    }
  }
}))
