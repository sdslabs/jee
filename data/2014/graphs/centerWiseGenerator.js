var fs = require('fs');

fs.readFile('../json/results_new.json', function(err, data){
	if( err )
		throw err
	var ranks = JSON.parse(data);
	var noOfRolls = {};
	ranks.results.map( function(r){
		center = r.rollno.substr(0,4);
		if( center in noOfRolls ){
			noOfRolls[center]++;
		} else {
			noOfRolls[center] = 1;
		}
	})
	var data ='';
	for ( center in noOfRolls){
		data += center + ' ' + noOfRolls[center] + '\n';
	}
	fs.writeFile('centerWiseRolls.txt', data, function(err){
		if(err)
			throw err;
		console.log('done');
	})
});	