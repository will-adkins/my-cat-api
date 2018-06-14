const database = [
  { id: 'tabby', type: 'breed', description: 'A great breed.' },
  { id: 'siamese', type: 'breed', description: 'The enemy of tabbies' },
  { id: 'maine coon', type: 'breed', description: 'A big soft breed of cat.' },
  { id: 'minx', type: 'breed', description: 'A crazy koo-koo breed of cat.' },
  {
    id: 'felix',
    type: 'cat',
    name: 'felix',
    breed: 'minx',
    owner: 'George Jefferson',
    age: 10
  },
  {
    id: 'tootles',
    type: 'cat',
    name: 'tootles',
    breed: 'tabby',
    owner: 'Trip Ottinger',
    age: 15
  },
  {
    id: 'abby',
    type: 'cat',
    name: 'abby',
    breed: 'siamese',
    owner: 'Sam Hunt',
    age: 3
  },
  {
    id: 'garfield',
    type: 'cat',
    breed: 'maine coon',
    name: 'garfield',
    owner: 'Nancy Higgins',
    age: 6
  }
]

module.exports = database
