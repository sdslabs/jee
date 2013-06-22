var lunr = require('./../js/lunr.min.js'),
    fs = require('fs')

var idx = lunr(function () {
  this.ref('rollno')
  this.field('name')
  this.field('air')
})

fs.readFile('../json/results_new.json', function (err, data) {
  if (err) throw err

  var raw = JSON.parse(data)

  var results = raw.results.map(function (r) {
    return {
      rollno : r.rollno,
      name : r.name,
      air : r.air
    }
  })

  console.log(results[0])

  results.forEach(function (result) {
    idx.add(result)
  })

  fs.writeFile('../json/results_index_new.json', JSON.stringify(idx), function (err) {
    if (err) throw err
    console.log('done')
  })
})