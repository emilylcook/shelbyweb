const navItems = {
  home: {
    to: '/',
    label: 'Home'
  },
  about: {
    to: '/About',
    label: 'About'
  },
  commissions: {
    to: '/Commissions',
    label: 'Commissions'
  },
  artwork: {
    // to: '/About',
    label: 'Artwork',
    subItems: [
      {
        to: '/artwork/petiteBloom',
        label: 'Petite Bloom'
      },
      {
        to: '/artwork/treelines',
        label: 'Treelines'
      },
      {
        to: '/artwork/StudioWork',
        label: 'Studio Work'
      },
      {
        to: '/artwork/EnPleinAir',
        label: 'En Plein Air'
      },
      {
        to: '/artwork/studioSale',
        label: 'Studio Sale'
      }
    ]
  }
};

export default navItems;
