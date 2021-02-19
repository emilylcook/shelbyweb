import React, { useState } from 'react';
import firebase from '../firebase';

export default function useArtData() {
  const [loadingArt, setLoadingArt] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [collections, setCollections] = useState([]);
  const [art, setArt] = useState([]);

  // initial load
  React.useEffect(() => {
    if (collections.length === 0) {
      loadCollections();
      loadArt();
    }
    // eslint-disable-next-line
  }, []);

  const clearArtData = () => {
    if (collections.length > 0) {
      setCollections();
      setArt([]);
    }
  };

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
    const storageRef = firebase.storage().ref();

    if (!art || art.length === 0) {
      let arts = [];
      firebase
        .database()
        .ref('arts')
        .once('value', async snapshot => {
          snapshot.forEach(collectionValues => {
            var artt = collectionValues.val();
            arts.push(artt);
          });

          let artsWithImages = await Promise.all(
            arts.map(async art => {
              let imageUrl = null;
              const imageName = art.image;

              if (!imageName) {
                return art;
              }

              imageUrl = await storageRef
                .child('images/' + imageName)
                .getDownloadURL()
                .then(url => {
                  return url;
                });

              return { ...art, path: imageUrl, imageUrl };
            })
          );

          setArt(artsWithImages);
          setLoadingArt(false);
        });
    }
  };

  const saveArt = async ({ artId, isNew, item }) => {
    let updatedArt = [...art];

    if (isNew) {
      const newArt = { ...item, id: artId };

      // Update art
      await firebase
        .database()
        .ref(`arts/${artId}`)
        .set(newArt);

      updatedArt.push(newArt);
    } else {
      var updates = {};
      updates['/arts/' + artId] = item;

      await firebase
        .database()
        .ref()
        .update(updates);

      // Update art
      const updatedIndex = updatedArt.findIndex(x => x.id === artId);

      if (updatedIndex > -1) {
        updatedArt[updatedIndex] = item;
      }
    }

    return updatedArt;
  };

  const saveCollection = async ({ collectionId, isNew, item }) => {
    let updatedCollections = [...collections];

    if (isNew) {
      const newCollection = { ...item, id: collectionId };

      // Update art
      await firebase
        .database()
        .ref(`newCollection/${collectionId}`)
        .set(newCollection);

      updatedCollections.push(newCollection);
    } else {
      var updates = {};
      updates['/newCollection/' + collectionId] = item;

      await firebase
        .database()
        .ref()
        .update(updates);

      // Update art
      const updatedIndex = updatedCollections.findIndex(x => x.id === collectionId);

      if (updatedIndex > -1) {
        updatedCollections[updatedIndex] = item;
      }

      setCollections(updatedCollections);
    }

    return updatedCollections;
  };

  return {
    clearArtData,
    loading: loadingArt || loadingCollections,
    art,
    collections,
    saveArt,
    saveCollection
  };
}

export const getDownloadUrl = async imageName => {
  const storageRef = firebase.storage().ref();

  return await storageRef
    .child('images/' + imageName)
    .getDownloadURL()
    .then(url => {
      return url;
    });
};

export async function removeItemFromCollection(artId, quantity = 1) {
  try {
    const snapshot = firebase
      .database()
      .ref('/arts/' + artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    let item = art;

    item.quantity = item.quantity - quantity;

    if (item.quantity === 0) {
      item.info.status = 'Sold';
      const index = item.tags.indexOf('available');

      if (index !== -1) {
        item.tags[index] = 'sold';
      }
    }

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/arts/' + artId] = item;

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

export const uploadImage = async ({ file, name }) => {
  const storageRef = firebase.storage().ref();
  try {
    const imageRef = storageRef.child(`images/${name}`);

    imageRef.put(file).then(function(snapshot) {});
  } catch (e) {
    console.log(e);
    return true;
  }
};
