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
	$.getJSON('./json/results_new.json', function (data) {

        //format the raw json into a form that is simpler to work with
        //also a global variable
        results = data.results.map(function (raw) {
          return {
            rollno : raw.rollno,
      		name : raw.name,
      		air : raw.air
          }
      	});
     })

	// Loads indexed JSON
	$.getJSON('./json/results_index_new.json', function (indexData) {
        console.time("load");
        //Gloabl idx variable
        idx = lunr.Index.load(indexData);
        console.timeEnd("load")
     })

	var search = function(){
		var query = input.val();
		var res = idx.search(query);
		//Convert the search results to an array of integers
		res=res.map(function(x){
			return x.ref
		});
        console.log(res);
       
		//Filter the results to only matching rollnumbers
		res=results.filter(function(x){
			if(res.indexOf(x.rollno)>-1)
				return true;
		});
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
			html += '<tr><td>' + results[i].rollno + '</td><td>' + results[i].name + '</td><td>' + results[i].air + '</td></tr>';
		}
		$('.search-result').append('<table>'+html+'</table>');
	}

	
})