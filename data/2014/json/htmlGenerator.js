var fs = require('fs');

fs.readFile('./results_new.json', function(err, data){
	if( err )
		throw err
	var ranks = JSON.parse(data);
	var html = '<table><tr><th colspan="3">Rank List</th></tr><tr><th>AIR</th><th>Name</th><th>Roll no</th></tr>'

	ranks.results.map( function(r){
		html += '<tr><td>'
			 + r.air
			 + '</td><td>'
			 + r.name
			 + '</td><td>'
			 + r.rollno
			 + '</td><tr>';
	});
	fs.writeFile('../list_2014.html', html, function(err){
		if(err)
			throw err;
		console.log('done');
	})
});