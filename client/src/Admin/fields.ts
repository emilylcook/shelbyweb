import { InputTextField, CheckboxField } from '../common';
import { FormField } from '../models/FormFields';
import CollectionsDropdown from './CollectionsDropdown';
import ImageSection from './ImageSection';

export const artMainFields: { [fieldName: string]: FormField } = {
  id: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'id',
    label: 'Id',
    InputComponent: InputTextField,
    disabled: true
  },
  name: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'name',
    label: 'Name',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    variant: 'outlined',
    transformation: {
      capitalize: true
    }
  },
  hidden: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'hidden',
    label: 'Hidden',
    InputComponent: CheckboxField
  },
  testOnly: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'testOnly',
    label: 'Test Flag',
    InputComponent: CheckboxField
  },
  path: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'path',
    label: 'path',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    variant: 'outlined'
  },

  collections: {
    gridWidth: { xs: 12, sm: 6, md: 2 },
    name: 'collections',
    label: 'Collections',
    InputComponent: CollectionsDropdown,
    variant: 'outlined',
    validator: {
      required: true
    }
  },
  tags: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'tags',
    label: 'Tags',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    helperText: 'Comma separated LOWERCASE list: "pet, commission, available, landscape"',
    variant: 'outlined'
  },

  // collections (array) - multi select dropdown
  // tags, COMMA SEPARATED STRING?

  quantity: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'quantity',
    label: 'Quantity',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  price: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'price',
    label: 'Price',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  }
};

export const artInfo: { [fieldName: string]: FormField } = {
  size: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'size',
    label: 'Size',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    variant: 'outlined'
  },
  status: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'status',
    label: 'Status',
    InputComponent: InputTextField, // TODO Dropdown 'Sold' or 'Available'
    validator: {
      required: true
    },
    variant: 'outlined'
  },
  type: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'type',
    label: 'Type',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    variant: 'outlined'
  }
};

export const imageFields: { [fieldName: string]: FormField } = {
  image: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'image',
    label: 'Image',
    InputComponent: ImageSection,
    validator: {
      required: true
    },
    variant: 'outlined'
  }
};

export const shippingDetails: { [fieldName: string]: FormField } = {
  pounds: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'pounds',
    label: 'Pounds',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  ounces: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'ounces',
    label: 'Ounces',
    InputComponent: InputTextField, // TODO Dropdown 'Sold' or 'Available'
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  width: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'width',
    label: 'Width',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  length: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'length',
    label: 'Length',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  Height: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'height',
    label: 'Height',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  },
  girth: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'girth',
    label: 'Girth',
    InputComponent: InputTextField,
    validator: {
      required: false
    },
    variant: 'outlined'
  }
};

export const collectionInfoFields: { [fieldName: string]: FormField } = {
  id: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'id',
    label: 'Id',
    InputComponent: InputTextField,
    disabled: true
  },
  title: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'title',
    label: 'Name',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    variant: 'outlined',
    transformation: {
      capitalize: true
    }
  },
  filters: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'filters',
    label: 'Filters',
    InputComponent: InputTextField,
    validator: {
      required: true
    },
    helperText: 'Comma separated (CASE SENSITIVE) list: "Available, Landscapes, Still Life"',
    variant: 'outlined'
  },
  hidden: {
    gridWidth: { xs: 12, sm: 6, md: 4 },
    name: 'hidden',
    label: 'Hidden',
    InputComponent: CheckboxField
  }
};
