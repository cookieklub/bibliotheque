function HomeCtrl($scope, $rootScope, $http){
	$scope.get_books = function(){
		var url = 'livres?';
		url += 'limit=' + $scope.filter.limit;
		url += '&offset=' + $scope.page.offset();
		url += '&read=' + $scope.filter.read;
		if($scope.filters){
			url += '&genre=' + $scope.filter.genre;
			url += '&search=' + $scope.filter.search;
		}
		$rootScope.scroll_top();
		$http.get(base_url(url))
		.error(function(response){
			console.log(response.error);
		})
		.then(function(response){
			console.log({
				TESTS:response.data.tests,
				RESPONSE:response
			});
			$scope.BOOKS = response.data.books;
			$scope.page.total(response.data.count);
		});
	};
	$scope.reset = function(){
		$scope.page.first();
		$scope.get_books();
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
	$scope.filter_genre = function(genre){
		if(genre == 'tous'){
			$scope.filter.genre = '';
		}
		else{
			$scope.filter.genre = genre;
		}
		$scope.reset();
	};
	$scope.reload = function(){
		window.location.reload();
	};
	$scope.init = function(){
		$scope.filters = false;
		$scope.get_genres();

		$scope.filter = {
			limit:5,
			page_limit:10,
			read:true,
			genre:'',
			search:''
		};
		$scope.page = new pageSystem($scope.filter.page_limit, $scope.filter.limit, $scope.get_books);
		$scope.get_books();

		$rootScope.screen_on();
	}
	$scope.init();
}