export type OrderType = 'asc' | 'desc';

// helper function to order the data
export function orderData(items: any, orderByCol: string, direction: OrderType) {
  if (orderByCol) {
    const sortOrder = direction === 'asc' ? -1 : 1;

    return items.sort(function(a: any, b: any) {
      if (!a[orderByCol] && !b[orderByCol]) {
        return 0;
      }

      if (!a[orderByCol]) {
        return sortOrder;
      }

      if (!b[orderByCol]) {
        return -sortOrder;
      }

      return a[orderByCol] > b[orderByCol] ? -sortOrder : sortOrder;
    });
  }

  return items;
}

export interface Art {
  id: string;
  name: string;
  image: string;
  collections: string[];
  tags: string[];
  path: string;
  status: string;
  info: {
    size: string;
    status: string;
    type: string;
  };

  // sale
  price: number;
  quantity: number;

  // shipping
  shippingDetails: {
    pounds: number;
    ounces: number;
    width: string;
    length: string;
    height: string;
    girth: string;
  };
}

export interface Column {
  id: any;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export const columns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 300 },
  { id: 'collections', label: 'Collections', minWidth: 170 },
  { id: 'tags', label: 'Tags', minWidth: 240 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'quantity', label: 'Quantity', minWidth: 120 },
  {
    id: 'shipping',
    label: 'Shipping Info',
    minWidth: 170,
    format: (value: number) => 'MISSING' // TODO
  }
];
