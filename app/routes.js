angular.module('app', ['ngRoute', 'Rootscope', 'Directives', 'Services', 'Filters'])

.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider.

    when('/', {templateUrl: 'views/home.html', controller: HomeCtrl}).
    when('/livre/nouveau', {templateUrl: 'views/new_book.html', controller: NewBookCtrl}).
    when('/livre/:id', {templateUrl: 'views/book.html', controller: BookCtrl}).
    when('/livre/:id/modifier', {templateUrl: 'views/edit_book.html', controller: EditBookCtrl}).

    when('/login', {templateUrl: 'views/login.html', controller: LoginCtrl}).

    otherwise({redirectTo: '/'});
}]);