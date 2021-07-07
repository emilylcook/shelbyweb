import React, { useState } from 'react';
import firebase from '../firebase';

export default function useArtData() {
  const [loadingArt, setLoadingArt] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [collections, setCollections] = useState<any[]>([]);
  const [art, setArt] = useState<any>([]);

  const artCollection = process.env.NODE_ENV !== 'production' ? 'devArts' : 'arts';

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
      setCollections([]);
      setArt([]);
    }
  };

  const loadCollections = () => {
    let collections: any[] = [];
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
      let arts: any[] = [];
      firebase
        .database()
        .ref(artCollection)
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

  const saveArt = async ({ artId, isNew, item }: any) => {
    let updatedArt = [...art];

    if (isNew) {
      const newArt = { ...item, id: artId };

      // Update art
      await firebase
        .database()
        .ref(`${artCollection}/${artId}`)
        .set(newArt);

      updatedArt.push(newArt);
    } else {
      var updates: any = {};
      updates[`/${artCollection}/` + artId] = item;

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

  const saveCollection = async ({ collectionId, isNew, item }: any) => {
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
      var updates: any = {};
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

export const getDownloadUrl = async (imageName: string) => {
  const storageRef = firebase.storage().ref();

  return await storageRef
    .child('images/' + imageName)
    .getDownloadURL()
    .then(url => {
      return url;
    });
};

export async function removeItemFromCollection(artId: any, quantity: number = 1) {
  try {

  const artCollection = process.env.NODE_ENV !== 'production' ? 'devArts' : 'arts';

    const snapshot = firebase
      .database()
      .ref(`/${artCollection}/` + artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    let item = art;
    let updateItem :any = {}

    item.quantity = item.quantity - quantity;


    if (item.quantity === 0) {
      item.info.status = 'Sold';
      const index = item.tags.indexOf('available');

      if (index !== -1) {
        item.tags[index] = 'sold';
      }
    }

    updateItem.quantity =  item.quantity
    updateItem.info = item.info
    updateItem.tags = item.tags

     await firebase.database().ref(`/${artCollection}/` + artId).update(updateItem)
  

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }

  // MAYBE:
  // (trigger set art reload?)
}

export async function confirmItemIsAvailable(collectionId: any, artId: any) {
  let item: any = {};
  const artCollection = process.env.NODE_ENV !== 'production' ? 'devArts' : 'arts';


  try {
    const snapshot = firebase
      .database()
      .ref(`/${artCollection}/` + artId)
      .once('value');

    const value = await snapshot;
    const art = value.val();

    item = art;

    return !!item && item?.quantity > 0;
  } catch (e) {
    console.log(e);
    return true;
  }
}

export const uploadImage = async ({ file, name }: any) => {
  const storageRef = firebase.storage().ref();
  try {
    const imageRef = storageRef.child(`images/${name}`);

    imageRef.put(file).then(function(snapshot) {});
  } catch (e) {
    console.log(e);
    return true;
  }
};
