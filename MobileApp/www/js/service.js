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
}]);
