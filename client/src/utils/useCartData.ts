import firebase from '../firebase';

export function addProductToCart(item: any) {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  if (products.findIndex((x: any) => x.id === item.id) > -1) {
    return { success: false, error: 'Item already in cart!' };
  } else {
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products)); // set products as an array

    let expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1);
    localStorage.setItem('cartExpires', JSON.stringify(expiresOn));

    return { success: true };
  }
}

function checkCartIsValid() {
  const expiresOnString = localStorage.getItem('cartExpires');
  const expiresOn = new Date(JSON.parse(expiresOnString ?? '{}'));

  const now = new Date();
  const validCart = expiresOn > now;

  if (expiresOnString && !validCart) {
    localStorage.removeItem('products');
    localStorage.removeItem('cartExpires');
  }

  return validCart;
}

export function getItemsInCart() {
  checkCartIsValid();
  let productsString = localStorage.getItem('products');

  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  return products;
}

export function getNumberOfItemsInCart() {
  checkCartIsValid();
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  return products.length || 0;
}

export function removeItemFromCart(id: any) {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);

    const itemToRemove = products.findIndex((x: any) => x.id === id);

    if (itemToRemove > -1) {
      products.splice(itemToRemove, 1);
      localStorage.setItem('products', JSON.stringify(products)); // set products as an array
      return products;
    }

    return false;
  }
}

export function clearCart() {
  localStorage.setItem('products', JSON.stringify([]));
}

export const getSalesRate = async (zip5: any, zip4: any) => {
  const snapspot = firebase
    .database()
    .ref('/salesTax/' + zip5)
    .once('value');

  const value = await snapspot;
  const tax = value.val();

  if (!tax) {
    return 0;
  }

  const combinedRate = tax[zip4];

  if (!combinedRate) {
    return tax['lowest'];
  }

  return combinedRate;
};

export const addOrderToDatabase = async ({ orderNumber, order }: any) => {
  const data = { ...order, orderNumber };

  const collection = process.env.NODE_ENV !== 'production' ? 'devOrders' : 'Orders';

  await firebase
    .database()
    .ref(`${collection}/${orderNumber}`)
    .set(data);

  return true;
};
