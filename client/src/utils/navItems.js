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
        to: '/artwork/nocturnes',
        label: 'Nocturnes'
      },
      {
        to: '/artwork/2019',
        label: '2019'
      },
      {
        to: '/artwork/2018',
        label: '2018'
      },
      {
        to: '/artwork/treelines',
        label: 'Treelines'
      },
      {
        to: '/artwork/earlier-works',
        label: 'Earlier Works'
      }
    ]
  }
}

export default navItems
