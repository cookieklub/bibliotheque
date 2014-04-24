// ENVIRONMENTS
var $environments = {
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
var config = {
	base_url:$environments['remote'].url + "api/laravel/public/",
	upload_url:$environments['remote'].url + "api/laravel/public/uploads/"
};

// AUTOMATICALLY DETECTS ENVIRONMENT
(function Environment(){
	var host = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
	for(environment in $environments){
		if(host == $environments[environment].host){
			config.base_url = $environments[environment].url + "api/laravel/public/";
			config.upload_url = $environments[environment].url + "api/laravel/public/uploads/";
			console.log(config);
			break;
		}
	}
})();

