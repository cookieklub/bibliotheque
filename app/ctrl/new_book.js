function NewBookCtrl($scope, $rootScope, formData, $http){
	$scope.post_book = function(){
        $scope.form_test = function(){
            var form = [
                // {success:($scope.DATA.titre != undefined && $scope.DATA.titre != ''), error:'Veuillez entrer un titre.'},
                // {success:($scope.DATA.auteur != undefined && $scope.DATA.auteur != ''), error:'Veuillez entrer un auteur.'},
                // {success:($scope.DATA.edition != undefined && $scope.DATA.edition != ''), error:'Veuillez entrer une édition.'},
                // {success:($scope.DATA.annee != undefined && $scope.DATA.annee != ''), error:'Veuillez entrer une année d\'édition.'},
                // {success:($scope.DATA.public != undefined && $scope.DATA.public != ''), error:'Veuillez entrer un public visé.'},
                // {success:($scope.DATA.provenance != undefined && $scope.DATA.provenance != ''), error:'Veuillez entrer la provenance de votre ouvrage.'},
                // {success:($scope.DATA.genre != undefined && $scope.DATA.genre != ''), error:'Veuillez entrer un genre.'},
                // {success:($scope.DATA.resume != undefined && $scope.DATA.resume != ''), error:'Veuillez entrer un résumé.'},
                // {success:($scope.DATA.biographie != undefined && $scope.DATA.biographie != ''), error:'Veuillez entrer une biographie de l\'auteur.'},
            ];
            for(i in form){
                if(!form[i].success){
                    return {error:true, info:form[i].error}
                }
            }
            return {error:false, info:'saving fundraiser...'}
        };
        var form_result = $scope.form_test();
        if(form_result.error){$rootScope.alert_error(form_result.info);}else{$scope.post_book_validation();}
    };
    $scope.post_book_validation = function(){
    	var data = {
            titre:$scope.DATA.titre,
            auteur:$scope.DATA.auteur,
            edition:$scope.DATA.edition,
            annee:$scope.DATA.annee,
            public:$scope.DATA.public,
            provenance:$scope.DATA.provenance,
            site:$scope.DATA.site,
            genre:$scope.DATA.genre,
            mots_cles:$scope.DATA.tags,
            resume:$scope.DATA.resume,
            avis:$scope.DATA.avis,
            pedagogie:$scope.DATA.pedagogie,
            biographie:$scope.DATA.biographie,
            read:$scope.DATA.read,
            love:$scope.DATA.love,
        };
        $scope.formData.setData(data);
        $scope.formData.send(base_url('livres'), function(response){
            console.log(response);
            $rootScope.info_modal('Votre livre a bien été créé.', function(){
                $rootScope.navigate('/');
            });
        });
    };
	$scope.validate_form = function(){
		$rootScope.scroll_top(0, 0, function(){
			$('.menu-info').delay(300).fadeIn(500, function(){
				$('.menu-info').delay(2000).fadeOut(500, function(){
				});
			})
		});
	};
	$scope.save_picture = function(){
		showPreview($('#file')[0].files,$('#preview'));
        $scope.formData.setFile($("#file")[0].files, 'illustration');
    };
    $scope.add_tag = function(tag){
    	if($scope.DATA.new_tag != ''){
    		if($scope.DATA.tags.indexOf(tag)<0){
	            $scope.DATA.tags.push(tag);
	            $scope.DATA.new_tag = '';
	        }
    	}
    };
    $scope.remove_tag = function(tag){
        var index = $scope.DATA.tags.indexOf(tag);
        if (index > -1) {
            $scope.DATA.tags.splice(index, 1);
        }
    };
    $scope.get_genres = function(){
        $http.get(base_url('genres'))
        .error(function(response){
            console.log(response.error);
        })
        .then(function(response){
            //console.log(response.data);
            $scope.GENRES = response.data.genres;
        });
    };
    $scope.add_genre = function(){
        var new_genre = prompt('Nom du nouveau type');
        if(new_genre != ''){
            $scope.post_genre(new_genre);
        }
    };
    $scope.post_genre = function(genre){
        $http.post(base_url('genres'), {genre:genre})
        .error(function(response){
            console.log(response);
        })
        .then(function(response){
            console.log(response);
            $scope.get_genres();
        });
    };
	$scope.init = function(){
        $scope.get_genres();
		$scope.formData = new formData($scope);
		$scope.DATA = {
			titre:'',
			auteur:'',
			edition:'',
			annee:'',
			public:'',
			provenance:'',
			site:'',
			genre:'',
			resume:'',
			avis:'',
			pedagogie:'',
			biographie:'',
			love:false,
			read:false,
			new_tag:'',
			tags:[]
		};
		$rootScope.screen_on();
	};
	$scope.init();
}