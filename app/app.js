/*#######################################################################
  
  Adegboyega Olawale
  
  #######################################################################*/

var app = angular.module('customersApp', ['firebase', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'ngCookies', 'angularUtils.directives.dirPagination']);
app.constant('FIREBASE_URI', 'https://iratebuks.firebaseio.com/bookDetails');
app.constant('FIREBASE_URI_CLIENTS', 'https://iratebuks.firebaseio.com/Clients');

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                templateUrl: '/app/views/HomeView.html'
            })
        .otherwise({ redirectTo: '/' });
});




