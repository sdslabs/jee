$(document).ready(function(){
	var width  = $(window).width();
	// $(body).css("width","100px");
	if(width<1200)
	{
		console.log("2");
		$("#toplogo").removeClass("logo");
	}
	$(window).resize(function() {
		width  = $(window).width();
		if(width<1200)
		{
			console.log("2");
			$("#toplogo").removeClass("logo");
		}
		else {
			$("#toplogo").addClass("logo");

		}	 
	});	
})