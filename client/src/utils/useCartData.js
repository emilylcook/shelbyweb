export function addProductToCart(item) {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  if (products.findIndex(x => x.id === item.id) > -1) {
    return { success: false, error: 'Item already in cart!' };
  } else {
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products)); // set products as an array

    return { success: true };
  }
}

export function getItemsInCart() {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  return products;
}

export function getNumberOfItemsInCart() {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);
  }

  return products.length || 0;
}

export function removeItemFromCart(id) {
  let productsString = localStorage.getItem('products');
  let products = [];
  if (productsString) {
    products = JSON.parse(productsString);

    const itemToRemove = products.findIndex(x => x.id === id);

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
