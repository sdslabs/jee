/** Array shims for IE*/
//Copied from http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
/** Our JS */

$(function(){
	var submit = $('.search-submit');
	var input = $('.search-box');

	//Loads the result
	var href = 'data/2014/json'
	var index = document.location.href.indexOf('2013')
	if(index != -1){
		href = '../data/2013/json';
	}
	$.getJSON( href + '/results_new.json', function (data) {

        //format the raw json into a form that is simpler to work with
        //also a global variable
        results = data.results.map(function (raw) {
          return {
            rollno : raw.rollno,
      		name : raw.name,
      		rank : raw.rank,
      		category : raw.category
          }
      	});
     })

	// Loads indexed JSON
	$.getJSON( href + '/results_index_new.json', function (indexData) {
        console.time("load");
        //Gloabl idx variable
        idx = lunr.Index.load(indexData);
        console.timeEnd("load")
     })

	var search = function(){
		var query = input.val();
		if (query != '') {
			var res = idx.search(query);
			//Convert the search results to an array of integers
			res=res.map(function(x){
				return x.ref;
			});
			//Filter the results to only matching rollnumbers
			res=results.filter(function(x){
				if(res.indexOf(x.rollno)>-1)
					return true;
			});
			$('#tablecontainer').hide();
			if (res.length==0)
				$('.search-result').html('Sorry, no results found!');
			else
				display(res);
		}
		else {
			$('#tablecontainer').show();
			$('.search-result').html('');
		}
	}


	submit.on('click',search);
	input.on('keypress',function(e){
		if(e.which == 13){
			search();
		}
	});

	var display = function(results){
		$('.search-result').html('');

		var head = '<tr><th colspan="3">Results Found: '+ results.length +'</th></tr></table>';
		var cmlHtml = '<table><tr><th colspan="3">Common Merit List</th></tr><tr><th>AIR</th><th>Name</th><th>Roll no</th></tr>'
		var obcHtml = '<table><tr><th colspan="3">OBC Rank List</th></tr><tr><th>OBC Rank</th><th>Name</th><th>Roll no</th></tr>'
		var scHtml = '<table><tr><th colspan="3">SC Rank List</th></tr><tr><th>SC Rank</th><th>Name</th><th>Roll no</th></tr>'
		var stHtml = '<table><tr><th colspan="3">ST Rank List</th></tr><tr><th>ST Rank</th><th>Name</th><th>Roll no</th></tr>'
		var prepHtml = '<table><tr><th colspan="3">Preparatory Rank List</th></tr><tr><th>Preparatory Rank</th><th>Name</th><th>Roll no</th></tr>'
		var cmlPwdHtml = '<table><tr><th colspan="3">General(PwD) Rank List</th></tr><tr><th>General (Pwd) Rank</th><th>Name</th><th>Roll no</th></tr>'
		var obcPwdHtml = '<table><tr><th colspan="3">OBC(PwD) Rank List</th></tr><tr><th>OBC(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'
		var scPwdHtml = '<table><tr><th colspan="3">SC(PwD) Rank List</th></tr><tr><th>SC(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'
		var stPwdHtml = '<table><tr><th colspan="3">ST(Pwd) Rank List</th></tr><tr><th>ST(PwD) Rank</th><th>Name</th><th>Roll no</th></tr>'
		console.log("R");
		var cml = 0, obc = 0, sc = 0, st = 0, prep = 0, cmlPwd = 0, obcPwd = 0, scPwd = 0, stPwd = 0;
		for(i in results){
			var html = '<tr><td>' + results[i].rank + '</td><td>' + results[i].name + '</td><td>' + results[i].rollno + '</td></tr>';

		if(results[i].category == "cml")
		{
			cmlHtml += html;
			cml++;
		}
		else if(results[i].category == "obc")
		{
			obcHtml += html;
			obc++;
		}
		else if(results[i].category == "sc")
		{
			scHtml += html;
			sc++;
		}
		else if(results[i].category == "st")
		{
			stHtml += html;
			st++;
		}
		else if(results[i].category == "prep")
		{
			prepHtml += html;
			prep++;
		}
		else if(results[i].category == "cmlPwd")
		{
			cmlPwdHtml += html;
			cmlPwd++;
		}
		else if(results[i].category == "obcPwd")
		{
			obcPwdHtml += html;
			obcPwd++;
		}
		else if(results[i].category == "scPwd")
		{
			scPwdHtml += html;
			scPwd++;
		}
		else if(results[i].category == "stPwd")
		{
			stPwdHtml += html;
			stPwd++;
		}
		}

		var content = head;

		if(cml!=0)
			content += cmlHtml + "</table>";
		if(obc!=0)
			content += obcHtml + "</table>";
		if(sc!=0)
			content += scHtml + "</table>";
		if(st!=0)
			content += stHtml + "</table>";
		if(prep!=0)
			content += prepHtml + "</table>";
		if(cmlPwd!=0)
			content += cmlPwdHtml + "</table>";
		if(obcPwd!=0)
			content += obcPwdHtml + "</table>";
		if(scPwd!=0)
			content += scPwdHtml + "</table>";
		if(stPwd!=0)
			content += stPwdHtml + "</table>";

		$('.search-result').append('<table>'+content+'</table>');
	}

	
})