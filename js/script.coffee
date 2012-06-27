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
      d.pd_rank=+d.pd_rank
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
    Results.filterCenter = (center)->
      return @ if center=='any'
      (i.filter=false for i in @ when (i.center!=center))
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
      Results
      .clearFilter()
      .filterMarks($('#marks_min').val(),$('#marks_max').val())
      .filterAIR($('#air_min').val(),$('#air_max').val())
      .filterGender($('#gender').val())
      .filterCategory($('#category').val())
      .filterCenter(parseInt($('#center').val()))
      Results.filterBranches(branchCodes) if Courses.codes.length != branchCodes.length
        
      total=0
      total++ for r in Results when r.filter==true
      $("#results_number").text(total)

    $('input,select').change refresh
    $('#refresh').click (confirm=true)->
      if(parseInt($("#results_number").text()) > 2000)
        confirm=window.confirm("You are rendering a large number of records. This may cause your browser to hang for a while. Are you sure you want to continue? ")
      Results.toString() if confirm
      false
    #This is the main csv parser for results
    #function for each time we receive some
    #content over ajax
    Results.toString =() ->
      html=''
      testStart = new Date();
      for user in @
        continue unless user.filter
        #Rank Stuff
        ranks=''
        ranks+=" #{user.cml} (AIR)" if user.cml>0
        ranks+=" #{user.category} (#{user.category})" if user.category_rank>0
        ranks+=" #{user.pd_rank} (#{user.category}_PD)" if user.pd_rank>0

        #Marks stuff
        marks="N/A"
        marks="#{user.marks} (#{user.physics}+#{user.chemistry}+#{user.maths})" if user.marks!=0

        #Course stuff
        courseId1 = Courses.codes.indexOf(user.alloted) if user.alloted
        courseId2 = Courses.codes.indexOf(user.alloted2) if user.alloted2
        alloted = "#{Courses[courseId1].branch}, #{Courses[courseId1].institute}" if user.alloted
        alloted2 = "#{Courses[courseId2].branch}, #{Courses[courseId2].institute}" if user.alloted2
        center = $("#center option[value='#{user.center}']").text() if user.center
        html+="<tr>
            <td>#{ranks}</td>
            <td>#{user.name}</td>
            <td>#{user.category}</td>
            <td title=\"#{Courses[courseId1].course}\">#{alloted ? ' - ' }</td>
            <td title=\"#{Courses[courseId2].course}\">#{alloted2 ? ' - ' }</td>
            <td>#{center ? "N/A"}</td>
            <td>#{marks}</td>
            <td>#{user.sex}</td>
          </tr>"
      $("#results").html(html)
)