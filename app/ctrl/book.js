function BookCtrl($scope, $rootScope, $routeParams, $http){
	$scope.get_book = function(){
		$http.get(base_url('livres/' + $routeParams.id))
		.error(function(response){
			console.log(response.error);
			//window.location.href = '/';
		})
		.then(function(response){
			if(response.data.error){
				console.log(response.data);
				//window.location.href = '/';
			}
			else{
				console.log(response.data);
				$scope.BOOK = response.data.book;
				$rootScope.screen_on();
			}
		});
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
	$scope.edit_book = function(){
		$rootScope.navigate('/livre/' + $routeParams.id + '/modifier');
	};
	$scope.init = function(){
		$scope.get_genres();
		$scope.get_book();
	};
	$scope.init();
}