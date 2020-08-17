export const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}/;

export const shippingAddressFields = [
  {
    label: 'First Name',
    key: 'shippingFirstName',
    name: 'firstName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Last Name',
    key: 'shippingLastName',
    name: 'lastName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Address Line 1',
    key: 'shippingStreetAddress',
    name: 'address',
    required: true,
    xs: 12,
    sm: 12
  },
  {
    label: 'Address Line 2',
    key: 'shippingStreetAddress2',
    name: 'address2',
    xs: 12,
    sm: 6
  },
  {
    label: 'City',
    key: 'shippingCity',
    name: 'city',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Postal Code',
    key: 'shippingPostal',
    name: 'postal',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'State',
    key: 'shippingState',
    name: 'state',
    required: true,
    xs: 12,
    sm: 6
  }
];

export const billingAddressFields = [
  {
    label: 'First Name',
    key: 'billingFirstName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Last Name',
    key: 'billingLastName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Address Line 1',
    key: 'billingStreetAddress',
    required: true,
    xs: 12,
    sm: 12
  },
  {
    label: 'Address Line 2',
    key: 'billingStreetAddress2',
    xs: 12,
    sm: 6
  },
  {
    label: 'City',
    key: 'billingCity',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Postal Code',
    key: 'billingPostal',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'State',
    key: 'billingState',
    required: true,
    xs: 12,
    sm: 6
  }
];
