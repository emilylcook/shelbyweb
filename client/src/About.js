import React from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { Icon, Typography, Avatar, Grid } from '@material-ui/core';
import clsx from 'clsx';

import WidthContainer from './WidthContainer';
import Hero from './Hero';
import { HorizontalTitle } from './common/';

import heroImg from './assets/hero/about_me_01.jpg';
import avatarImg from './assets/hero/about_me_avatar.jpg';

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
    // marginTop: 50,
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
}));

const About = () => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Hero heroImg={heroImg} grayscale={false} />
      {/* <Hero heroImg={heroImg} grayscale={false} title="About&nbsp;me" subText="" /> */}
      <WidthContainer className={classes.mainContent}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={12} md={7} className={clsx(classes.section)}>
            <HorizontalTitle title="About" includeSpacer />
            <Typography paragraph>
              Shelby K Cook was born and raised in the Pacific Northwest of the USA. She has enjoyed
              drawing and painting since she was young, inspired by the natural landscape she grew
              up in. She studied fine art in college, earning her BFA from Western Washington
              University along with a BA in Art History. Specializing in painting, Cook uses
              contemporary realism to capture moments and tell stories about the landscapes and
              cities she visits.
            </Typography>
            <Typography paragraph>
              Cook frequently paints en plein air, relying on the changes of light and temperature
              around her to help her capture the feeling of being in the environment. She travels
              with her portable easel and aims to paint in as many countries as possible. In her
              studio work, she focuses on works based on her travels and memories, combining
              nostalgia with scenery as a way to remember and capture experiences. Alongside these,
              she uses nocturnes to explore the visual representation of insomnia. Darkness captures
              the isolation associated, while the subject matter of bars and nighttime streets
              showcase the variety of human interactions that take place when people are either
              choosing not to sleep or are physically unable to.
            </Typography>
            <Typography paragraph>
              Cook currently works and resides in Seattle, WA with her cats, Mog and Ilya.
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
                <Typography paragraph>
                  If you are interested in available pieces or collaborations, please reach out via
                  email.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </WidthContainer>
    </div>
  );
};

export default About;
