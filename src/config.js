export default {
  VERSION: process.env.REACT_APP_VERSION,
  API:
    process.env.REACT_APP_API ||
    'https://us-central1-emilypersonalweb-server.cloudfunctions.net/app'
}
