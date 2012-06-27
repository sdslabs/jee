requirejs(['jquery','d3','crossfilter','text!../data/center.csv'],($,d3=window.d3,crossfilter = window.crossfilter,Centers)->
  Candidate={}
  Centers = d3.csv.parse Centers
  Center ={}
  for i in Centers
    [code,city,state]=i
    Center[code] = [city,state]
  #d3.csv 'data/course.csv', (Course)->
  d3.csv 'data/results.csv', (Results)->
    Results.forEach (d,i)->
      d.reg=+d.reg
      d.cml=+d.cml
      d.category_rank=+d.category_rank
      d.pd_rank=d.pd_rank
      d.city = Center[d.center].city if Center[d.center]
      d.center=+d.center
      d.physics=+d.physics
      d.chemistry=+d.chemistry
      d.maths=+d.maths
    Candidate = crossfilter Results;
    all=Candidate.groupAll();
    AIR=Candidate.dimension (d)->
      return d.cml
    regNo = Candidate.dimension (d)->
      return d.reg
    course = Candidate.dimension (d) ->
      return d.alloted2
    courses = course.group()
    gender = Candidate.dimension (d)->
      return d.sex=='male'
    genderGroup = gender.group()
    mark = Candidate.dimension (d)->
      return d.physics+d.chemistry+d.maths
    marks = mark.group (m)->
      return m-m%10
    institute = Candidate.dimension (d)->
      return d.alloted2.substr(0,1)
    city = Candidate.dimension (d)->
      return d.center
    cities = city.group()
    #JQuery Event Handling for searching 
    $(document).ready ->
      $("#q").change (e) ->
        if @value.length >= 3
          val = @value
          $.get "index/" + val.substr(0, 2).toUpperCase() + ".json", (data) ->
            registrationNumbers = data[val.toUpperCase()]
            choose=(c)->
              return registrationNumbers.indexOf(c.reg)>-1
            rows=(c for c in Results when choose c)
            console.log rows
    refresh =() ->
      #Starting with marks
      #console.log mark.filterRange([$('#marks_min').val(),$('#marks_max').val()]).top(Infinity)
    $('input').change refresh

    $('.max').change ->
      console.log 
      $(@).val Math.max($($(@).prev()).val(),@value)
    $('.min').change ->
      console.log @value
      $(@).val Math.min($($(@).next()).val(),@value)
  #Handle the Center codes similarly
  
  #This is the main csv parser for results
  #function for each time we receive some
  #content over ajax
  csvToHTML = (csv,complete=false) ->
    @marker = @marker ? -1
    users = csv.split("\n")
    return if users.length<5
    arr = users.slice(@marker+1, users.length-1)
    arr = users if complete
    html=''
    testStart = new Date();
    for user in arr
      [CML_Rank,registrationNumber,Category,Category_rank, PD_Rank,name,alloted,alloted2,sex,center_code,physics,chem,maths] = user.split(",")
      #Rank Stuff
      ranks=''
      ranks+=" #{CML_Rank} (AIR)" if CML_Rank>0
      ranks+=" #{Category_rank} (#{Category})" if Category_rank>0
      ranks+=" #{PD_Rank} (#{Category}_PD)" if PD_Rank>0

      #Marks stuff
      total = parseInt(physics)+parseInt(chem)+parseInt(maths)
      marks="N/A"
      marks="#{total} (#{physics}+#{chem}+#{maths})" if total!=0

      #Course Stuff
      alloted = "#{Course[alloted][1]} (#{Course[alloted][0]})" if alloted
      alloted2 = "#{Course[alloted2][1]} (#{Course[alloted2][0]})" if alloted2
      html+="<tr>
          <td>#{ranks}</td>
          <td>#{name}</td>
          <td>#{Category}</td>
          <td>#{registrationNumber}</td>
          <td>#{alloted ? "" }</td>
          <td>#{alloted2 ? ""}</td>
          <td>#{center_code ? "N/A"}</td>
          <td>#{marks}</td>
          <td>#{sex}</td>
        </tr>"
  $('input').hover ->
    $(@).attr 'title',''
    $(@).attr 'title',$(@).val()
  
)