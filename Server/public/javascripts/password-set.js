var app=angular.module('Myapp',[]);
app.controller('Password-controller',['$scope','$http','$location',function($scope,$http,$location){
$scope.pwd={password1:"",password2:"",token:"",show:false};
//password mismatch checker
$scope.CheckPassword=function(){
if( !$scope.PwdForm.password1.$error.required && !$scope.PwdForm.password2.$error.required && ($scope.pwd.password1 != $scope.pwd.password2))
{
  $scope.pwd.show=true;
  $scope.PwdForm.$invalid=true;
}
else
{
$scope.pwd.show=false;
$scope.PwdForm.$invalid=false;
}

if(!$scope.pwd.password1)
{
$scope.pwd.password2="";
$scope.pwd.show=false;
$scope.PwdForm.password2.$setPristine();
}

if( $scope.PwdForm.password1.$error.required ||  $scope.PwdForm.password2.$error.required)
$scope.PwdForm.$invalid=true;
};
/**************************************************/
//on submit function

//extract token from url
var n = $location.$$absUrl.indexOf("signup");
var token=$location.$$absUrl.substring(n+7);
$scope.pwd.token=token;

$scope.onsubmitted=function()
{

$http({
  method: 'POST',
  url: 'http://localhost:3000/signup/setpassword',
  data: $scope.pwd
}).then(function success(response) {
      console.log(response.data);


  }, function error(response) {

      console.log("failure");
  });
//
};


/**************************************************/
}]);
