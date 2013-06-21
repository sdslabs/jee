$(function(){
	var submit = $('.search-submit');
	var input = $('.search-box');

	//Loads the result
	$.getJSON('./json/results.json', function (data) {

        //format the raw json into a form that is simpler to work with
        results = data.results.map(function (raw) {
          return {
            rollno : raw.rollno,
      		name : raw.name,
      		air : raw.air
          }

      })
     })

	// Loads indexed JSON
	$.getJSON('./json/results_index_2.json', function (indexData) {
        console.time("load")
        idx = lunr.Index.load(indexData);
        console.timeEnd("load")
     })

	var search = function(){
		var query = input.val();
		var res = idx.search(query).map(function(result){
			return results.filter(function(d){ return d.rollno === parseInt(result.ref); })[0];
		})
		console.log(res);
		display(res);
	}


	submit.on('click',search);
	input.on('keypress',function(e){
		if(e.which == 13){
			search();
		}
	});

	var display = function(results){
		$('.search-result').html('');
		var html = '<tr><th>Reg No</th><th>Name</th><th>Rank</th></tr>';
		for(i in results){
			html += '<tr><td>' + results[i].rollno + '</td><td>' + results[i].name + '</td><td>' + results[i].rank + '</td></tr>';
		}
		$('.search-result').append('<table>'+html+'</table>');
	}

	
})