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
  console.log(art);

  return { loading: loadingArt || loadingCollections, art, collections };
}

export async function removeItemFromCollection(artId, quantity = 1) {
  try {
    console.log('remove!!', artId);
    const snapshot = firebase
      .database()
      .ref('/arts/' + artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    let item = art;

    item.quantity = item.quantity - quantity;

    if (item.quantity === 0) {
      item.status = 'Sold';
      const index = item.tags.indexOf('available');

      if (index !== -1) {
        item.tags[index] = 'sold';
      }
    }

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/arts/' + artId] = item;

    console.log(updates);

    await firebase
      .database()
      .ref()
      .update(updates);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }

  // MAYBE:
  // (trigger set art reload?)
}

export async function confirmItemIsAvailable(collectionId, artId) {
  let item = {};

  try {
    const snapshot = firebase
      .database()
      .ref('/arts/' + artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    item = art;

    return !!item && item.quantity > 0;
  } catch (e) {
    console.log(e);
    return true;
  }
}
