var $gallery;

$(document).ready(function() {
	/************
		*********
		GESTION DES CLIC SUR LE MENU 
		*********
	************/
	var buttons = $("#menu li").not("#fleche");
	var buttons2 = $("#modale ul li");
	var current = $("#current");
	var promotion = $(".promotion");
	
	$("body").on("click", "#menu li" ,function() {
		var classe = $(this).data("target");
		$("#menu li").removeClass("active");
		$("#modale ul li").removeClass("active");
		$(this).addClass("active");
		if (classe!="fleche") {
			current.empty().append("Vous regardez actuellement la section <strong>" + $(this).data("name")) + "</strong>";
			filter(classe);
		}
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
		filter(classe);
	});
	$("body").on("click", ".promotion", function() {
		var classe = $(this).data("target");
		filter(classe);	
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
		Rafraichissement des données
		*********
	************/
	$("#logo").click(function() {
		updateProducts();
		getCategories();
	});
	
	
	/************
		*********
		RECUPERATEUR DE DONNEES
		*********
	************/
	
	init();

	
});

function init() {
	getCategories();
	getProduits();
}
function hideModale() {
	$("#modale").removeClass("slideInDown").addClass("slideOutUp");
}
function showModale() {
	$("#modale").removeClass("slideOutUp").addClass("slideInDown").css({"display":"block"});
}
function getProduits() {
	$("#chargement").css({"display":"block"});
	$("#gallery").empty();
	$.ajax({
	  	url: 'http://lepalaisdelucas.fr/api/getposts/?custom_post=produit',
	  	type: 'GET',
	  	dataType: 'jsonp',
	  	success: function (data, response) {
		    if (response == 'success') {
		        $.each(data.result, function(item, value) {
			        /* Récupération des données */
			        var element = '';
			        var price = value.custom_fields.prix;
			        var image = value.featuredimage;
			        var title = value.post_title; 
			        var coupdecoeur = value.custom_fields.coup_de_coeur_client;
			        var sous_titre = value.custom_fields.sous_titre;
			        var description = value.custom_fields.description_du_produit;
			        var parfums = value.custom_fields.parfums_disponibles;
			        var deguster = value.custom_fields.a_deguster_pour;
			        var categories = [];
			        $.each(value.taxonomies.famille, function(item, value){
				      categories.push(value.slug);  
			        });
			        
			        /* Affichage des données */
			        element += '<div class="gallery-cell';
			        for (i=0; i<categories.length; i++) {
				        element += ' ' + categories[i];
			        }
			        element += '" style="background-image:url('+image+')">'; 
			        
			        /* Contenu de l'element texte */
			        element += '<div class="texte">';
			        
				        /* Contenu de l'element left */
				        element += '<div class="left">';
					        /* Si coup de coeur */
					        if (coupdecoeur == true) {
						        element += '<div><span class="coupdecoeur"></span></div>';
					        }
					        /* Si titre */
					        if (title != "") {
						        element += '<h2>'+title+'</h2>';
					        }
					        /* Si sous-titre */
					        if (sous_titre != "") {
						        element += '<h4>'+sous_titre+'</h4>';
					        }
					        /* Si Description */
					        if (description  != "") {
						        element += '<div id="description"><div class="description">'+description+'</div></div>';
					        }
					        /* Si parfums */
					        if (parfums != "") {
						        element += '<div class="parfum"><span>Disponible également</span>'+parfums+'</div>';
					        }
				        element += '</div>';
				        /* Fin du Contenu de l'element left */
			        
				        /* Contenu de l'element right */
				        element += '<div class="droite">';
				        	/* Si Déguster */
				        	if (deguster != "") {
					        	element += '<div class="right"><span>A déguster par</span>';
					        	if (deguster <= 1) {
						        	element += deguster + ' personne';
					        	} else {
						        	element += deguster + ' personnes';
					        	}
					        	element += '</div>';
				        	}
				        	/* Si Prix */
				        	if (price != ""){
					        	element += '<div class="right prix"><span>Pour seulement</span>'+ price +'<sup>€</sup></div>';
				        	}
				        element += '</div>';
				        /* Fin du Contenu de l'element right */
			        
			        element += '</div>';
			        /* fin du contenu de l'element texte */
			        
			        $("#gallery").append(element);
		        });
		        
		        /* Récupération et affichage de promotions */
		        $.ajax({
				  	url: 'http://lepalaisdelucas.fr/api/getposts/?custom_post=promotion',
				  	type: 'GET',
				  	dataType: 'jsonp',
				  	success: function (data, response) {
					  	if (response == 'success') {
						  	$.each(data.result, function(item, value) {
							  	 var image = value.featuredimage;
							  	 var slug = value.custom_fields.categorie_de_produit.slug;
							  	 var title = value.post_title;
							  	 var element = "";
							  	 element += '<div class="gallery-cell promotions"><div class="promotion" data-target="'+slug+'"><img src="'+image+'" title="'+title+'"/></div></div>';
							  	 $("#gallery").prepend(element);
							});
						}
						$gallery = $('#gallery').flickity({
							cellAlign: 'left',
							prevNextButtons: false, 
							pageDots: false,
							cellAlign: "center",
							contain: true
						});
						$gallery.flickity('resize');
						$("#chargement").css({"display":"none"});
				  	}
				});
				
				/* Suppression du texte en excès */
				$(".description").dotdotdot();
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
			    shortlinks.append('<li id="fleche" data-target="fleche"><i class="glyphicon glyphicon-chevron-down"></i></li>');
			    shortlinks.prepend('<li class="all" data-target="all" data-name="Tout le catalogue">Tout afficher</li>');
		    }
		}
	});
}
function updateProducts() {
	$gallery.flickity('destroy');
	getProduits();
}
function filter(cible) {
	if (cible == "all") {
		$(".gallery-cell").css({"display":"block"});
		setTimeout(function() {
			$gallery.flickity('reloadCells');
			$gallery.flickity( 'select', 1)
		}, 800);
	} else {
		$(".gallery-cell").not(cible).css({"display":"none"});
		$(".gallery-cell."+ cible).css({"display":"block"});
		$(".gallery-cell.promotions").css({"display":"block"});
		setTimeout(function() {
			$gallery.flickity('reloadCells');
			$gallery.flickity( 'select', 1)
		}, 800);
	}
}
