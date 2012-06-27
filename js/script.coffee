requirejs(['jquery','d3','text!../data/course.csv'],($,d3=window.d3,CoursesCSV)->

  ## Array difference ##
  Array.prototype.intersect = (a) ->
    (i for i in @ when a.indexOf(i)>-1)
  Courses = d3.csv.parse CoursesCSV
  Courses.codes = (course.code for course in Courses)
  Courses.filterByName = (name)->
    return @codes if name==''
    name=name.toLowerCase()
    (course.code for course in @ when (course.code && course.branch.toLowerCase().indexOf(name)!=-1))
  Courses.filterByInsti = (instiCode)->
    return @codes if instiCode=='any'
    (course.code for course in @ when (course.code && course.code.substr(0,1)==instiCode))

  d3.csv 'data/results.csv', (Results)->
    Results.forEach (d,i)->
      d.reg=+d.reg
      d.cml=+d.cml
      d.category_rank=+d.category_rank
      d.pd_rank=d.pd_rank
      d.center=+d.center
      d.physics=+d.physics
      d.chemistry=+d.chemistry
      d.maths=+d.maths
      d.filter=true #Default filter value is true
      d.marks=d.physics+d.chemistry+d.maths
    #Since we want an intersection os all these filters
    #instead of marking each record as true
    #we instead remove records in each filter
    #at then end we are left with the intersected records only
    #filter=false means that the record has been removed
    #All of this can be optimized further by checking filters
    #only for stuff that is not already removed
    Results.clearFilter=()->
      i.filter=true for i in @
      @
    Results.filterMarks = (lower,upper) ->
      (i.filter=false for i in @ when (i.marks<lower || i.marks>upper))
      @
    #filterBranches is the costliest client side operation
    #It is performed only when needed
    Results.filterBranches = (branchCodes)->
      (i.filter=false for i in @ when (i.alloted2 not in branchCodes))
      @
    Results.filterAIR = (lower,upper) ->
      (i.filter=false for i in @ when (i.cml<lower || i.cml>upper))
      @
    Results.filterGender = (gender)->
      return @ if gender=='any'
      (i.filter=false for i in @ when (i.sex!=gender))
      @
    Results.filterCategory = (cat)->
      return @ if cat =='any'
      (i.filter=false for i in @ when (i.category!=cat))
      @
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
      branchCodes=Courses.filterByInsti($('#institute').val())
      branchCodes=branchCodes.intersect Courses.filterByName($('#alloted').val()) if $('#alloted').val()!=''
      console.log branchCodes
      Results
      .clearFilter()
      .filterMarks($('#marks_min').val(),$('#marks_max').val())
      .filterAIR($('#air_min').val(),$('#air_max').val())
      .filterGender($('#gender').val())
      .filterCategory($('#category').val())
      if (Courses.codes.length != branchCodes.length)
        console.log 1
        Results.filterBranches(branchCodes) 
      total=0
      total++ for r in Results when r.filter==true
      console.log total

    $('input,select').change refresh
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
)