var fs = require('fs');

fs.readFile('./results_new.json', function(err, data){
  if( err )
    throw err
  var ranks = JSON.parse(data);
  //var links = "<a href = '#cml'>CML</a><a href = '#obc'>OBC</a><a href = '#sc'>SC</a><a href = '#st'>ST</a><a href = '#prep'>Preparatory</a><a href = '#cmlPwd'>General(PD)</a><a href = '#obcPwd'>OBC(PD)</a>";
  var cmlHtml = '<table><tr><th colspan="3"><a name = "cml">Common Merit List</a></th></tr><tr><th>AIR</th><th>Name</th><th>Roll no</th></tr>'
  var obcHtml = '<table><tr><th colspan="3"><a name = "obc">OBC Rank List</a></th></tr><tr><th>OBC Rank</th><th>Name</th><th>Roll no</th></tr>'
  var scHtml = '<table><tr><th colspan="3"><a name = "sc">SC Rank List</a></th></tr><tr><th>SC Rank</th><th>Name</th><th>Roll no</th></tr>'
  var stHtml = '<table><tr><th colspan="3"><a name = "st">ST Rank List</a></th></tr><tr><th>ST Rank</th><th>Name</th><th>Roll no</th></tr>'
  var prepHtml = '<table><tr><th colspan="3"><a name = "prep">Preparatory Rank List</a></th></tr><tr><th>Preparatory Rank</th><th>Name</th><th>Roll no</th></tr>'
  var cmlPwdHtml = '<table><tr><th colspan="3"><a name = "cmlPwd">General(PD) Rank List</a></th></tr><tr><th>General (Pd) Rank</th><th>Name</th><th>Roll no</th></tr>'
  var obcPwdHtml = '<table><tr><th colspan="3"><a name = "obcPwd">OBC(PD) Rank List</a></th></tr><tr><th>OBC(PD) Rank</th><th>Name</th><th>Roll no</th></tr>'
  var scPwdHtml = '<table><tr><th colspan="3"><a name = "scPwd">SC(PD) Rank List</a></th></tr><tr><th>SC(PD) Rank</th><th>Name</th><th>Roll no</th></tr>'
  var stPwdHtml = '<table><tr><th colspan="3"><a name = "stPwd">ST(Pd) Rank List</a></th></tr><tr><th>ST(PD) Rank</th><th>Name</th><th>Roll no</th></tr>'

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
  
  //*var content = links + cmlHtml + "</table>" + obcHtml + "</table>" + scHtml + "</table>" + stHtml + "</table>" + prepHtml + "</table>";
  var content = cmlHtml + "</table>";
  //content += cmlPwdHtml + "</table>" + obcPwdHtml + "</table>" + scPwdHtml + "</table>" + stPwdHtml;
  //*content += cmlPwdHtml + "</table>" + obcPwdHtml
  
  fs.writeFile('../list_2015.html', content, function(err){
    if(err)
      throw err;
    console.log('done');
  })
});