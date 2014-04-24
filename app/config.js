var config = {};

// FRONT END ENVIRONMENTS
function set_environment(url){
	// BASE URLS USED
	config.base_url = url + "api/laravel/public/"; // API REQUESTS
	config.upload_url = url + "api/laravel/public/uploads/"; // SOURCE TO UPLOADS
}

var $environments = {
	// SETS DEFAULT ENVIRONMENT, IF NOT RECOGNIZED
	default:'remote',
	// DEFINES CURRENT HOST
	host:location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/",
	// ENVIRONMENTS
	local:{
		url:'http://localhost:8888/',
		host:'http://localhost:8888/'
	},
	remote:{
		url:'http://www.cookieklub.com/projects/bibliotheque/',
		host:'http://cookieklub.com/'
	}
};

// DEFAULT SETTINGS
set_environment($environments[$environments.default].url);

// AUTOMATICALLY DETECTS AND SETS ENVIRONMENT
(function Environment(){
	for(environment in $environments){
		if($environments.host == $environments[environment].host){
			set_environment($environments[environment].url);
			break;
		}
	}
})();