import React, { useState } from 'react';
import firebase from '../firebase';

export default function useCollectionData() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  // initial  load
  React.useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    let collections = [];
    firebase
      .database()
      .ref('collections')
      .on('value', snapshot => {
        snapshot.forEach(collectionValues => {
          var collection = collectionValues.val();
          collections.push(collection);
        });

        setCollections(collections);
        setLoading(false);
      });
  };

  return { loading, collections };
}

export function removeItemFromCollection(id) {}

export async function confirmItemIsAvailable(collectionId, artId) {
  let item = {};

  try {
    const snapshot = firebase
      .database()
      .ref('collections')
      .orderByChild('id')
      .equalTo(collectionId)

      .once('value');

    const value = await snapshot;
    const collection = value.val();

    item = Object.values(collection)[0].art?.find(x => x.id === artId);

    return !!item && item.quantity > 0;
  } catch (e) {
    console.log(e);
    return false;
  }
}
