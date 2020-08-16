import * as firebase from 'firebase'

const firebaseConfig = require('./firebaseConfig.json')

firebase.initializeApp(firebaseConfig)

export default firebase
