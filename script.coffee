#This is the main parser
#function for each time we receive some
#content over ajax
csvToHTML = (csv) ->
  @marker = @marker ? -1
  users = csv.split("\n")
  return if users.length<5
  arr = users.slice(@marker+1, users.length-1)
  for user in arr
    [CML_Rank,registrationNumber,Category,Category_rank, PD_Rank,name,alloted,alloted2,real_code,city] = user.split(",")
    ranks=''
    ranks+=" #{CML_Rank} (AIR)" if CML_Rank>0
    ranks+=" #{Category_rank} (#{Category})" if Category_rank>0
    ranks+=" #{PD_Rank} (#{Category}_PD)" if PD_Rank>0
    $('#results').append("<tr>
        <td>#{ranks}</td>
        <td>#{name}</td>
        <td>#{Category}</td>
        <td>#{registrationNumber}</td>
        <td>#{alloted ? "" }</td>
        <td>#{alloted2 ? ""}</td>
        <td>#{city ? "N/A"}</td>
      </tr>")
  #Update marker
  @marker = users.length-1;

#Make the ajax request
myxhr = new XMLHttpRequest()
myxhr.open "GET", "results.csv"
myxhr.onreadystatechange = ->
  csvToHTML @responseText
myxhr.send null

#JQuery Event Handling for searching 
#@remove
$(document).ready ->
  $("#q").change (e) ->
    if @value.length >= 3
      val = @value
      $.get "index/" + val.substr(0, 2).toUpperCase() + ".json", (data) ->
        console.log data[val.toUpperCase()]