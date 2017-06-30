angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProductsCtrl',['$scope','SendFactory',function($scope,SendFactory){


  SendFactory.seturl('products','GET','');
  SendFactory.send()
  .then(function success(response){
    $scope.products=response.data;
  },function failure(response){
    console.log("failure");
  });

}])
/********************************************************************************************/
//controller for the sign up function
.controller('SignupController',['$scope','$state','SendFactory','$ionicLoading','$ionicPopup','$timeout',function($scope,$state,SendFactory,$ionicLoading,$ionicPopup,$timeout){
console.log("haiii");
$scope.signup={};
$scope.Form={};
//on form submission
$scope.OnSubmission=function(){
      //for showing the server delay
      $ionicLoading.show({
               content: 'Loading',
               animation: 'fade-in',
               showBackdrop: true,
               maxWidth: 200,
               showDelay: 0
             });
      SendFactory.seturl('signup','POST',$scope.signup);
      SendFactory.send()
      .then(function success(response)
      {
        console.log(response);
        $ionicLoading.hide();
        //clear the form
        $scope.signup={};
        $scope.Form.SignupForm.$setPristine();
        $scope.Form.SignupForm.$setUntouched();
        //alert box showing messages
        $ionicPopup.alert({
           title: 'Online Shopping site',
           template: response.data.status,
           okText:'Okay!'
         }).then(function(res) {
           $state.transitionTo('app.'+response.data.dest, {}, { reload: true, inherit: true, notify: true });
         });

      },function failure(response)
      {
        $ionicLoading.hide();
        $ionicLoading.show({
            template: 'Network Error',
            scope: $scope
          });
         $timeout(function() {
             $ionicLoading.hide();
         }, 2000);
      });
};

}])

/********************************************************************************************/

.controller('ProductCtrl', function($scope, $stateParams) {
});
