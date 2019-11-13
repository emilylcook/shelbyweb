const navItems = {
  home: {
    to: '/',
    label: 'Home'
  },
  about: {
    to: '/About',
    label: 'About'
  },
  artwork: {
    // to: '/About',
    label: 'Artwork',
    subItems: [
      {
        to: '/artwork/2019',
        label: '2019'
      },
      {
        to: '/artwork/2018',
        label: '2018'
      },
      {
        to: '/artwork/earlier-works',
        label: 'Earlier Works'
      }
    ]
  },
  contact: {
    to: '/connect',
    label: 'Connect'
  }
}

export default navItems
