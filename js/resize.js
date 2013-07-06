$(document).ready(function(){
	var width  = $(window).width();
	if(width<1200)
	{
		$("#toplogo").removeClass("logo");
	}
	$(window).resize(function() {
		width  = $(window).width();
		if(width<1200)
		{
			$("#toplogo").removeClass("logo");
		}
		else {
			$("#toplogo").addClass("logo");

		}	 
	});	
})