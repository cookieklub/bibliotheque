function LoginCtrl($scope, $rootScope){
	$scope.login = function(){
		if($scope.password == '$'){
			$rootScope.session = true;
			$rootScope.navigate('/');
			console.log('okok');
		}
		else{
			console.log('oh oh');
		}
	};
	$scope.init = function(){
		if($rootScope.session){
			window.location.href = '#/';
		}
	};
	$scope.init();
}