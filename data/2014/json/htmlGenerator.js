var fs = require('fs');

fs.readFile('./results_new.json', function(err, data){
	if( err )
		throw err
	var ranks = JSON.parse(data);
	var cmlHtml = '<table><tr><th colspan="3">Common Merit List</th></tr><tr><th>AIR</th><th>Name</th><th>Roll no</th></tr>'
	var obcHtml = '<table><tr><th colspan="3">OBC Rank List</th></tr><tr><th>OBC Rank</th><th>Name</th><th>Roll no</th></tr>'
	var scHtml = '<table><tr><th colspan="3">SC Rank List</th></tr><tr><th>SC Rank</th><th>Name</th><th>Roll no</th></tr>'
	var stHtml = '<table><tr><th colspan="3">ST Rank List</th></tr><tr><th>ST Rank</th><th>Name</th><th>Roll no</th></tr>'
	var prepHtml = '<table><tr><th colspan="3">Preparatory Rank List</th></tr><tr><th>Preparatory Rank</th><th>Name</th><th>Roll no</th></tr>'
	var cmlPwdHtml = '<table><tr><th colspan="3">General(PwD) Rank List</th></tr><tr><th>General (Pwd) Rank</th><th>Name</th><th>Roll no</th></tr>'
	var obcPwdHtml = '<table><tr><th colspan="3">OBC(PwD) Rank List</th></tr><tr><th>OBC(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'
	var scPwdHtml = '<table><tr><th colspan="3">SC(PwD) Rank List</th></tr><tr><th>SC(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'
	var stPwdHtml = '<table><tr><th colspan="3">ST(Pwd) Rank List</th></tr><tr><th>ST(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'

	ranks.results.map( function(r){

		var html = '<tr><td>'
				 + r.rank
			 	+ '</td><td>'
			 	+ r.name
			 	+ '</td><td>'
			 	+ r.rollno
			 	+ '</td></tr>';
		if(r.category == "cml")
			cmlHtml += html;
		else if(r.category == "obc")
			obcHtml += html;
		else if(r.category == "sc")
			scHtml += html;
		else if(r.category == "st")
			stHtml += html;
		else if(r.category == "prep")
			prepHtml += html;
		else if(r.category == "cmlPwd")
			cmlPwdHtml += html;
		else if(r.category == "obcPwd")
			obcPwdHtml += html;
		else if(r.category == "scPwd")
			scPwdHtml += html;
		else if(r.category == "stPwd")
			stPwdHtml += html;
	});

	var content = cmlHtml + "</table>" + obcHtml + "</table>" + scHtml + "</table>" + stHtml + "</table>" + prepHtml + "</table>";
	//content += cmlPwdHtml + "</table>" + obcPwdHtml + "</table>" + scPwdHtml + "</table>" + stPwdHtml;
	content += cmlPwdHtml + "</table>" + obcPwdHtml
	
	fs.writeFile('../list_2014.html', content, function(err){
		if(err)
			throw err;
		console.log('done');
	})
});