import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Avatar } from '@material-ui/core'
import clsx from 'clsx'

import WidthContainer from '../WidthContainer'
import Hero from '../Hero'
import { HorizontalTitle } from '../common/'

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
    margin: '0 1rem 1rem 0',
    display: 'inline-block',
    width: '100%'
    // width: 300,
    // // background: '#EC985A',
    // color: 'white',
    // margin: '0 1rem 1rem 0'
    // // display: 'inline-block',
    // // width: '100%',
    // // textAlign: 'center',
    // // fontFamily: 'system-ui',
    // // fontWeight: 900,
    // // fontSize: '2rem'
  }
}))

const Artwork = ({ match }) => {
  const classes = useStyles()

  const collectionName = match.params.collection

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
              return <img className={classes.masonaryItem} src={path} />
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
