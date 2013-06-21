var lunr = require('./../js/lunr.min.js'),
    fs = require('fs')

var idx = lunr(function () {
  this.ref('regno')
  this.field('name')
  this.field('rank')
})

fs.readFile('../json/format.json', function (err, data) {
  if (err) throw err

  var raw = JSON.parse(data)

  var results = raw.results.map(function (r) {
    return {
      regno : r.regno,
      name : r.name,
      rank : r.rank
    }
  })

  results.forEach(function (result) {
    idx.add(result)
  })

  fs.writeFile('../json/example_index.json', JSON.stringify(idx), function (err) {
    if (err) throw err
    console.log('done')
  })
})