export default {
  VERSION: process.env.REACT_APP_VERSION,
  USPS_USER_ID: process.env.REACT_APP_USPS_USER_ID || '675SHELB3149',
  API: process.env.REACT_APP_API || 'https://us-central1-shelbyart-8c287.cloudfunctions.net/app'
};
