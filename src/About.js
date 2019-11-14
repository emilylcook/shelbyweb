import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, lighten } from '@material-ui/core/styles'
import { Icon, Typography, Avatar } from '@material-ui/core'
import clsx from 'clsx'

import WidthContainer from './WidthContainer'
import Hero from './Hero'
import { HorizontalTitle } from './common/'

import heroImg from './assets/hero/about_me_01.jpg'
import avatarImg from './assets/hero/about_me_avatar.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex' /* or inline-flex */,
    minHeight: '100%'
  },
  subTitle: {
    marginBottom: '15px'
  },
  mainContent: {
    marginTop: 50,
    marginBottom: 100
  },
  section: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
      paddingRight: 15
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 5,
      paddingRight: 5
    }
  },
  rightContainer: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
    filter: 'grayScale(75%)',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 35
    }
  },
  avatar: {
    margin: 10,
    width: 300,
    height: 300,
    [theme.breakpoints.down('md')]: {
      marginTop: 50,
      width: 300,
      height: 300
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 30,
      width: 300,
      height: 300
    }
  },
  iconContainer: {
    margin: '5px 10px'
  },
  icon: {
    color: theme.palette.text.primary,
    // margin: '0 10px',
    fontSize: '2rem',
    transition: '1s all',
    '&:hover': {
      color: lighten(theme.palette.text.primary, 0.25)
    }
  },
  contactMeSection: {
    textAlign: 'center'
  }
}))

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.content}>
      <Hero heroImg={heroImg} grayscale={false} />
      {/* <Hero heroImg={heroImg} grayscale={false} title="About&nbsp;me" subText="" /> */}
      <WidthContainer className={classes.mainContent}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={12} md={7} className={clsx(classes.section)}>
            <HorizontalTitle title="About Me" includeSpacer />
            <Typography paragraph>
              Adipiscing commodo elit at imperdiet dui. Ut porttitor leo a diam sollicitudin tempor
              id. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Urna condimentum
              mattis pellentesque id nibh. In hac habitasse platea dictumst vestibulum rhoncus est.
              Cursus mattis molestie a iaculis at. Aliquam purus sit amet luctus venenatis lectus
              magna. Nam libero justo laoreet sit amet cursus. Varius quam quisque id diam vel quam
              elementum pulvinar etiam. Egestas quis ipsum suspendisse ultrices gravida. Et netus et
              malesuada fames ac turpis egestas. Sit amet commodo nulla facilisi nullam vehicula
              ipsum. Vestibulum lorem sed risus ultricies. Risus in hendrerit gravida rutrum
              quisque. Ipsum dolor sit amet consectetur. Ut pharetra sit amet aliquam id diam
              maecenas. Pellentesque sit amet porttitor eget. Pellentesque habitant morbi tristique
              senectus. Nisi vitae suscipit tellus mauris a diam maecenas. Turpis tincidunt id
              aliquet risus feugiat in.
            </Typography>
            <Typography paragraph>
              Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Aenean
              pharetra magna ac placerat vestibulum lectus mauris. Lobortis feugiat vivamus at augue
              eget arcu dictum varius duis. Nisi scelerisque eu ultrices vitae auctor eu augue ut
              lectus. Dictum sit amet justo donec enim diam. Eget nunc lobortis mattis aliquam
              faucibus purus in massa tempor. Enim diam vulputate ut pharetra sit amet aliquam id.
              Pretium viverra suspendisse potenti nullam. Mattis aliquam faucibus purus in massa
              tempor nec feugiat. Sed turpis tincidunt id aliquet risus feugiat in ante. Dictumst
              vestibulum rhoncus est pellentesque.xs
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} className={clsx(classes.section)}>
            <Grid container className={classes.rightContainer}>
              <Grid item xs={12} className={clsx(classes.avatarContainer)}>
                <Avatar alt="Shelby Cook" src={avatarImg} className={classes.avatar} />
              </Grid>
              <Grid item xs={12} md={10} className={classes.contactMeSection}>
                <HorizontalTitle title="Contact Me" includeSpacer />
                <Typography paragraph>
                  <a
                    href="https://www.instagram.com/shelbykcook/"
                    className={classes.iconContainer}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon className={clsx(classes.icon, 'fab fa-instagram')} />
                  </a>
                  <a
                    href="mailto:shelbykcook.art@gmail.com"
                    className={classes.iconContainer}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon className={clsx(classes.icon, 'fa fa-envelope')} />
                  </a>
                </Typography>
              </Grid>
              <Grid item xs={12} md={10}>
                <HorizontalTitle title="Sub Title" includeSpacer />
                <Typography paragraph>
                  Nam libero justo laoreet sit amet cursus. Varius quam quisque id diam vel quam
                  elementum pulvinar etiam. Egestas quis ipsum suspendisse ultrices gravida. Et
                  netus et malesuada fames ac turpis egestas. Sit amet commodo nulla facilisi nullam
                  vehicula ipsum. Vestibulum lorem sed risus ultricies. Risus in hendrerit gravida
                  rutrum quisque. Ipsum dolor sit amet consectetur. Ut pharetra sit amet aliquam id
                  diam maecenas.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </WidthContainer>
    </div>
  )
}

export default About
