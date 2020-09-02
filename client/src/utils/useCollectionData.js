import React, { useState } from 'react';
import firebase from '../firebase';

export default function useArtData() {
  const [loadingArt, setLoadingArt] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [collections, setCollections] = useState([]);
  const [art, setArt] = useState([]);

  // initial load
  React.useEffect(() => {
    loadCollections();
    loadArt();
  }, []);

  const loadCollections = () => {
    let collections = [];
    firebase
      .database()
      .ref('newCollection')
      .on('value', snapshot => {
        snapshot.forEach(collectionValues => {
          var collection = collectionValues.val();
          collections.push(collection);
        });

        setCollections(collections);
        setLoadingCollections(false);
      });
  };

  const loadArt = () => {
    let collections = [];
    firebase
      .database()
      .ref('arts')
      .on('value', snapshot => {
        snapshot.forEach(collectionValues => {
          var collection = collectionValues.val();
          collections.push(collection);
        });

        setArt(collections);
        setLoadingArt(false);
      });
  };

  return { loading: loadingArt || loadingCollections, art, collections };
}

export function removeItemFromCollection(id) {
  // remove 1 frmo quanity
  // if 0
  // remove available tag
  // add sold tag
  // set status to sold
}

export async function confirmItemIsAvailable(collectionId, artId) {
  let item = {};

  try {
    const snapshot = firebase
      .database()
      .ref('arts')
      .orderByChild('id')
      .equalTo(artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    item = art[1];

    return !!item && item.quantity > 0;
  } catch (e) {
    console.log(e);
    return false;
  }
}
