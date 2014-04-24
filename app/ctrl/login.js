function LoginCtrl($scope, $rootScope){
	$scope.login = function(){
		if($scope.password == '$'){
			$.cookie('session', 'connected', { expires: 1 });
			$rootScope.navigate('/');
		}
		else{
			$rootScope.alert_error('Mauvais mot de passe.');
		}
	};
	$scope.init = function(){
		if($.cookie('session') == 'connected'){
			window.location.href = '#/';
		}
		else{
			// delete cookies
	    	$.cookie('session', null);
		}
	};
	$scope.init();
}