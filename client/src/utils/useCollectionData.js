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

  const saveArt = async ({ artId, item }) => {
    if (!artId) {
      throw Error('no new art');
    }

    var updates = {};
    updates['/arts/' + artId] = item;

    console.log(item);
    await firebase
      .database()
      .ref()
      .update(updates);

    // Update art
    const updatedArt = [...art];
    const updatedIndex = updatedArt.findIndex(x => x.id === artId);

    if (updatedIndex > -1) {
      updatedArt[updatedIndex] = item;
    }

    return updatedArt;
  };

  return { clearArtData, loading: loadingArt || loadingCollections, art, collections, saveArt };
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
      console.log(item);
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

    console.log('upload-', file);
    imageRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });
  } catch (e) {
    console.log(e);
    return true;
  }
};
