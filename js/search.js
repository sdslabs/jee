$(function(){
	var submit = $('.search-submit');
	var input = $('.search-box');

	//Loads the result
	$.getJSON('./json/format.json', function (data) {

        //format the raw json into a form that is simpler to work with
        results = data.results.map(function (raw) {
          return {
            regno : raw.regno,
      		name : raw.name,
      		rank : raw.AIR
          }

      })
     })

	// Loads indexed JSON
	$.getJSON('./json/example_index.json', function (indexData) {
        console.time("load")
        idx = lunr.Index.load(indexData);
        console.timeEnd("load")
     })


	submit.on('click', function(){
		var query = input.val();
		var res = idx.search(query).map(function(result){
			return results.filter(function(d){ return d.regno === parseInt(result.ref); })[0];
		})
		display(res);
	})

	var display = function(results){
		$('.search-result').html('');
		var html = '<tr><th>Reg No</th><th>Name</th><th>Rank</th></tr>';
		for(i in results){
			html += '<tr><td>' + results[i].regno + '</td><td>' + results[i].name + '</td><td>' + results[i].rank + '</td></tr>';
		}
		$('.search-result').append('<table>'+html+'</table>');
	}

})