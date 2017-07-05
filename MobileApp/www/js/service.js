'use strict';

angular.module('starter.service', ['ngResource'])

.constant('baseUrl','http://localhost:3000/')
//factory for sending http requests to server
.factory('SendFactory',['$http','baseUrl',function($http,baseUrl){
var url1="",method="",data="";
var obj={};
obj.seturl=function(url,method1,data1)
{
url1=baseUrl+url;
method=method1;
data=data1;
};
console.log(url1);
obj.send=function(){
return $http({method:method,url:url1,data:data}) ;
};
return obj;
}])
//code for injecting authenticaation JWT ITO HTTP headers
.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage['token']) {
        config.headers.Authorization = 'JWT ' + $window.localStorage['token'];
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
