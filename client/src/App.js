import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import '@fortawesome/fontawesome-free/css/all.css';

import HomeScreen from './Home/';
import AboutScreen from './AboutScreen';
import Footer from './Footer';
import ArtworkScreen from './Artwork';
import Header from './Header';
import CommissionsScreen from './Commissions/CommissionsScreen';
import { useScrollRestoration } from './utils';

import getAllImages from './Artwork/imagesForPreload';
import CheckoutScreen from './Cart/CheckoutScreen';
import CheckoutSuccessScreen from './Cart/CheckoutSuccessScreen';
import ShoppingCartScreen from './Cart/ShoppingCartScreen';
import LoginScreen from './Auth/LoginScreen';
import LogOutScreen from './Auth/LogoutScreen';
import ManageArt from './Admin/ManageArt';
import ManageCollections from './Admin/ManageCollections';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    zIndex: 10
    // backgroundColor: '#e8e8e8'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  container: {
    //padding: '15px 15px 60px 15px',
    top: 64,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      top: 54
    }
  },
  body: {
    minHeight: 'calc(100vh - 50px)'
  },
  hidden: {
    display: 'none'
  }
}));

const PreloadImages = classes => {
  let allImages = getAllImages();
  return (
    <div id="preload" className={classes.hidden} style={{ display: 'none' }}>
      {allImages.map(item => (
        <img
          key={item}
          className={classes.hidden}
          style={{ display: 'none' }}
          alt={item}
          src={item}
        />
      ))}
    </div>
  );
};

const App = () => {
  useScrollRestoration();
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <main className={classes.container}>
          {/* main component to render */}

          {/* <NavSpacer /> */}

          <div className={classes.body}>
            <Switch>
              <Route path="/" exact component={HomeScreen} />
              {/* admin routes */}

              <Route path="/admin/manage" component={ManageArt} />
              <Route path="/admin/manage-collections" component={ManageCollections} />

              {/* normal routes */}
              <Route path="/about" exact component={AboutScreen} />
              <Route path="/commissions" exact component={CommissionsScreen} />
              <Route path="/artwork/:collection" component={ArtworkScreen} />
              <Route path="/cart" component={ShoppingCartScreen} />
              <Route exact={true} path="/checkout" component={CheckoutScreen} />
              <Route exact={true} path="/checkout/success" component={CheckoutSuccessScreen} />
              <Route path="/login" component={LoginScreen} />
              <Route path="/logout" component={LogOutScreen} />
              <Redirect to="/" />
            </Switch>
          </div>
          <PreloadImages classes={classes} />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default App;
