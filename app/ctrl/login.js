function LoginCtrl($scope, $rootScope){
	$scope.login = function(){
		if($scope.password == '$'){
			$rootScope.session = true;
			$rootScope.navigate('/');
		}
		else{
			alert('Mauvais mot de passe.');
		}
	};
	$scope.init = function(){
		if($rootScope.session){
			window.location.href = '#/';
		}
	};
	$scope.init();
}