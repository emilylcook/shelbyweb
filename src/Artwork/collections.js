const c2019 = [
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art02.jpg',
    name: 'Title 02',
    info: 'info 02'
  },
  {
    path: '/artwork/art03.png',
    name: 'Title 03',
    info: 'info 03'
  },
  {
    path: '/artwork/art04.jpg',
    name: 'Title 04',
    info: 'info 04'
  },
  {
    path: '/artwork/art05.jpg',
    name: 'Title 05',
    info: 'info 05'
  },
  {
    path: '/artwork/art06.jpg',
    name: 'Title 06',
    info: 'info 06'
  },
  {
    path: '/artwork/art07.jpg',
    name: 'Title 07',
    info: 'info 07'
  },
  {
    path: '/artwork/art08.jpg',
    name: 'Title 08',
    info: 'info 08'
  },
  {
    path: '/artwork/art09.jpg',
    name: 'Title 09',
    info: 'info 09'
  },
  {
    path: '/artwork/art10.jpg',
    name: 'Title 10',
    info: 'info 10'
  }
]

const c20182019 = [
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art02.jpg',
    name: 'Title 02',
    info: 'info 02'
  },
  {
    path: '/artwork/art03.png',
    name: 'Title 03',
    info: 'info 03'
  },
  {
    path: '/artwork/art10.jpg',
    name: 'Title 10',
    info: 'info 10'
  },
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art02.jpg',
    name: 'Title 02',
    info: 'info 02'
  }
]

const earlierWorks = [
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art01.jpg',
    name: 'Title 01',
    info: 'info 01'
  },
  {
    path: '/artwork/art02.jpg',
    name: 'Title 02',
    info: 'info 02'
  },
  {
    path: '/artwork/art02.jpg',
    name: 'Title 02',
    info: 'info 02'
  }
]

export default function getCollection(name) {
  switch (name) {
    case '2019':
      return {
        title: '2019',
        collection: c2019
      }

    case '2018':
      return {
        title: '2018',
        collection: c20182019
      }
    case 'earlier-works':
      return {
        title: 'Earlier Works',
        collection: earlierWorks
      }
    default:
      return {
        title: 'not found',
        collection: []
      }
  }
}
