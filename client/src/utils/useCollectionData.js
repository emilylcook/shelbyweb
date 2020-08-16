import React, { useState } from 'react'
import firebase from '../firebase'

export default function useCollectionData() {
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState([])

  // initial  load
  React.useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = () => {
    let collections = []
    firebase
      .database()
      .ref('collections')
      .on('value', snapshot => {
        snapshot.forEach(collectionValues => {
          var collection = collectionValues.val()
          collections.push(collection)
        })

        setCollections(collections)
        setLoading(false)
      })
  }

  return { loading, collections }
}
