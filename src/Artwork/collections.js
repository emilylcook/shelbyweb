const c2019 = [
  {
    path: '/artwork/2019/Botanical Bench.jpg',
    name: 'Botanical Bench',
    info: { type: 'Acrylic on Canvas Board', size: '6x8”', status: 'Available' }
  },
  {
    path: '/artwork/2019/Cat Nap.png',
    name: 'Cat Nap',
    info: { type: 'Acrylic on Panel', size: null, status: 'Sold' }
  },
  {
    path: '/artwork/2019/Cattle Point.jpg',
    name: 'Cattle Point',
    info: { type: 'Acrylic on Panel', size: '6x6”', status: 'Available' }
  },
  {
    path: '/artwork/2019/Lopez.jpg',
    name: 'Lopez',
    info: { type: 'Acrylic on Panel', size: '10x10”', status: 'Available' }
  },
  {
    path: '/artwork/2019/Stalker.jpg',
    name: 'Stalker',
    info: { type: 'Acrylic on Panel', size: '10x10”', status: 'Available' }
  },
  {
    path: '/artwork/2019/The Crow.jpg',
    name: 'The Crow',
    info: { type: 'Acrylic on Panel', size: '5x7”', status: 'Available' }
  },
  {
    path: '/artwork/2019/The Secret.jpg',
    name: 'The Secret',
    info: { type: 'Acrylic on Canvas', size: '8x8”', status: 'Available' }
  },
  {
    path: '/artwork/2019/Tofino.jpg',
    name: 'Tofino',
    info: { type: 'Acrylic on Canvas Board', size: '6x8”', status: 'Available' }
  },
  {
    path: '/artwork/2019/Self-Portrait.png',
    name: 'Self Portrait',
    info: { type: 'Acrylic on Canvas', size: '12” Round', status: 'Available' }
  }
]

const c2018 = [
  {
    path: '/artwork/2018/cutts_island.jpg',
    name: 'Cutts Island',
    info: { type: 'Acrylic on Canvas Board', size: '', status: 'Available' }
  },
  {
    path: '/artwork/2018/deception_pass.jpg',
    name: 'Deception Pass',
    info: { type: 'Acrylic on Panel', size: '6x12”', status: 'Available' }
  },
  {
    path: '/artwork/2018/lopez_island.jpg',
    name: 'Lopez Island',
    info: { type: 'Acrylic on Panel', size: '11x14”', status: 'Available' }
  }
]

const earlierWorks = [
  {
    path: '/artwork/earlier_works/Gardenias.jpg',
    name: 'Gardenias',
    info: {
      type: 'Acrylic on Panel',
      size: '5x7”',
      status: 'Available'
    }
  },
  {
    path: '/artwork/earlier_works/Apples.jpg',
    name: 'Apples',
    info: { type: 'Acrylic on Panel', size: '5x7”', status: 'Available' }
  },
  {
    path: '/artwork/earlier_works/Bear.jpg',
    name: 'Bear',
    info: { type: 'Acrylic on Panel', size: '6x8”', status: 'Available' }
  },
  {
    path: '/artwork/earlier_works/Fenced In.jpg',
    name: 'Fenced In',
    info: { type: 'Acrylic on Panel', size: '8x10”', status: 'Sold' }
  },
  {
    path: '/artwork/earlier_works/December.jpg',
    name: 'December',
    info: { type: 'Acrylic on Panel', size: '12x6”', status: 'Sold' }
  },
  {
    path: '/artwork/earlier_works/Forest with Dogwoods.jpg',
    name: 'Forest with Dogwoods',
    info: { type: 'Acrylic on Canvas', size: '36x48”', status: 'Sold' }
  },
  {
    path: '/artwork/earlier_works/Forest.jpg',
    name: 'Forest',
    info: { type: 'Acrylic on Panel', size: '12x24”', status: 'Sold' }
  },
  {
    path: '/artwork/earlier_works/Mt.Erie.jpg',
    name: 'Mt. Erie',
    info: { type: 'Acrylic on Panel', size: '6x12”', status: 'Sold' }
  },
  {
    path: '/artwork/earlier_works/Twin Trees.jpg',
    name: 'Twin Trees',
    info: { type: 'Acrylic on Panel', size: '5x7”', status: 'Available' }
  },
  {
    path: '/artwork/earlier_works/zion.jpg',
    name: 'Zion',
    info: { type: 'Acrylic on Canvas', status: 'Sold' }
  }
]

const treelines = [
  {
    path: '/artwork/treelines/Ascent.jpg',
    name: 'Ascent',
    info: { type: 'Acrylic on Canvas', size: '36x48”', status: 'Sold' }
  },
  {
    path: '/artwork/treelines/Portal.jpg',
    name: 'Portal',
    info: { type: 'Acrylic on Canvas', size: '30x48”', status: 'Available' }
  },
  {
    path: '/artwork/treelines/Merge.jpg',
    name: 'Merge',
    info: { type: 'Acrylic on Canvas', size: '30x48”', status: 'Available' }
  },
  {
    path: '/artwork/treelines/Autumn.jpg',
    name: 'Autumn',
    info: { type: 'Acrylic on Canvas', size: '36x48”', status: 'Available' }
  },
  {
    path: '/artwork/treelines/Mist.jpg',
    name: 'Mist',
    info: { type: 'Acrylic on Canvas', size: '48x60”', status: 'Available' }
  },
  {
    path: '/artwork/treelines/Filter.jpg',
    name: 'Filter',
    info: { type: 'Acrylic on Canvas', size: '48x120”', status: 'Available' }
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
        collection: c2018
      }
    case 'earlier-works':
      return {
        title: 'Earlier Works',
        collection: earlierWorks
      }
    case 'treelines':
      return {
        title: 'Treelines',
        collection: treelines
      }
    default:
      return {
        title: 'not found',
        collection: []
      }
  }
}
