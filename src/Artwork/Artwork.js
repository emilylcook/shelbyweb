import React, { useState } from 'react'
// import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'

import WidthContainer from '../WidthContainer'
// import Hero from '../Hero'
// import { HorizontalTitle } from '../common/'

import { allArt } from './collection'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  masonaryContainer: {
    marginTop: 50,
    columns: '3 300px',
    columnGap: '1rem'
    // display: 'flex',
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    // maxHeight: 1300
  },
  masonaryItem: {
    color: 'white',
    display: 'block',
    width: '100%'
    // boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)'
  },
  tile: {
    position: 'relative',
    overflow: 'hidden',
    margin: '0 1rem 1rem 0',
    textAlign: 'left',
    opacity: 0.99,
    borderRadius: 3,
    // boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
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
      transitionDuration: '.3s'
    }
  },
  tileHover: {
    '&:before': {
      opacity: 1
    }
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
    top: 100,
    transitionProperty: 'top, opacity',
    transitionDuration: '.3s',
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
    transitionDelay: '0.25s'
  },
  content: {
    marginBottom: 100
  }
}))

const Artwork = ({ match }) => {
  const classes = useStyles()
  const [hoverOn, setHoverOn] = useState(null)

  const collectionName = match.params.collection
  console.log(collectionName)

  let collection = allArt

  return (
    <div className={classes.content}>
      {/* <Hero heroImg={heroImg} grayscale={false} /> */}
      {/* <Hero heroImg={heroImg} grayscale={false} title="About&nbsp;me" subText="" /> */}
      <WidthContainer className={classes.mainContent}>
        <div className={classes.masonaryContainer}>
          {Object.entries(collection).map(
            ([key, { path }]) => {
              // <div key={key}>{path}</div>
              // console.log(path)
              // const t = require(path)
              const isHovered = hoverOn === key
              return (
                <div
                  key={key}
                  className={clsx(classes.tile, { [classes.tileHover]: isHovered })}
                  onMouseEnter={() => setHoverOn(key)}
                  onMouseLeave={() => setHoverOn(null)}
                >
                  <img className={classes.masonaryItem} alt={'temporary '} src={path} />
                  <div className={classes.details}>
                    <Typography
                      className={clsx(classes.paragraph, classes.title, {
                        [classes.paragraphHover]: isHovered
                      })}
                    >
                      Title
                    </Typography>
                    <Typography
                      className={clsx(classes.paragraph, classes.info, {
                        [classes.paragraphHover]: isHovered
                      })}
                    >
                      Info
                    </Typography>
                  </div>
                </div>
              )
            }
            // <div key={key} className={classes.subMenuItemContainer}>
            //   <Link to={to} className={classes.subMenuItem}>
            //     {label}
            //   </Link>
            // </div>
          )}
        </div>
        {/* <Grid container className={classes.container}></Grid> */}
      </WidthContainer>
    </div>
  )
}

export default Artwork
