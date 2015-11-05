$(document).ready(function() {
	/************
		*********
		GESTION DES CLIC SUR LE MENU 
		*********
	************/
	var buttons = $("#menu li").not("#fleche");
	var buttons2 = $("#modale ul li");
	var current = $("#current");
	
	$("body").on("click", "#menu li" ,function() {
		var classe = $(this).data("target");
		$("#menu li").removeClass("active");
		$("#modale ul li").removeClass("active");
		$(this).addClass("active");
		current.empty().append("Vous regardez actuellement la section <strong>" + $(this).data("name")) + "</strong>";
	});
	$("body").on("click", "#modale ul li", function() {
		var classe = $(this).data("target");
		$("#menu li").removeClass("active");
		$("#modale ul li").removeClass("active");
		$(this).addClass("active");
		setTimeout(function() {
			hideModale();
		}, 1000);
		current.empty().append("Vous regardez actuellement la section <strong>" + $(this).data("name")) + "</strong>";
	});
	/************
		*********
		GESTION DES CLIC SUR LE MENU 
		*********
	************/
	var fleche = $("#fleche");
	$("body").on("click", "#fleche", function() {
		showModale();
	});
	
	var close = $("#close");
	close.click(function(){
		hideModale();
	});
	
	
	/************
		*********
		RECUPERATEUR DE DONNEES
		*********
	************/
	
	getCategories();
	getProduits();
	
});

function hideModale() {
	$("#modale").removeClass("slideInDown").addClass("slideOutUp");
}

function showModale() {
	$("#modale").removeClass("slideOutUp").addClass("slideInDown").css({"display":"block"});
}

function getProduits() {
	$.ajax({
	  	url: 'http://lepalaisdelucas.fr/api/getposts/?custom_post=produit',
	  	type: 'GET',
	  	dataType: 'jsonp',
	  	success: function (data, response) {
		    if (response == 'success') {
		        $.each(data.result, function(item, value) {
			        console.log(value.post_title);
		        });
		    }
		}
	});
}

function getCategories() {
	var shortlinks = $("#shorlinks");
	var mainmenu = $("#mainmenu");
	mainmenu.empty();
	shortlinks.empty();
	$.ajax({
	  	url: 'http://lepalaisdelucas.fr/api/get_taxonomy/?taxonomy_name=famille&orderby=date',
	  	type: 'GET',
	  	dataType: 'jsonp',
	  	success: function (data, response) {
		    if (response == 'success') {
		        $.each(data.result, function(item, value) {
			        if (item <= 3) {
				        shortlinks.append('<li class="'+value.slug+'" data-target="'+value.slug+'" data-name="'+value.name+'">'+value.name+'</li>');
			        }
			        mainmenu.append('<li class="'+value.slug+'" data-target="'+value.slug+'" data-name="'+value.name+'">'+value.name+'</li>');
			    }); 
			    shortlinks.append('<li id="fleche"><i class="glyphicon glyphicon-chevron-down"></i></li>');
			    shortlinks.prepend('<li class="all" data-target="all" data-name="active">Tout afficher</li>');
		    }
		}
	});
}