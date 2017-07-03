angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
   $scope.show=true;
   $rootScope.$on('someEvents', function(mass, data) { $scope.show=data; });
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
.factory('PersonService', function($http){
	var BASE_URL = "http://api.randomuser.me/";
	var items = [];

	return {
		GetFeed: function(){
			return $http.get(BASE_URL+'?results=10').then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetNewUsers: function(){
			return $http.get(BASE_URL+'?results=10').then(function(response){
				items = response.data.results;
				return items;
			});
		}
	}
})
/********************************************************************************************/
.controller('ProductsCtrl',['$scope','$stateParams','SendFactory','$rootScope', 'PersonService',function($scope,$stateParams,SendFactory,$rootScope, PersonService){

 $rootScope.$on('someEvent', function(mass, data) {
   $scope.catid=data;

  });




 $scope.items = [];

	PersonService.GetFeed().then(function(items){
		$scope.items = items;
	});

	$scope.loadMore = function() {
		PersonService.GetNewUsers().then(function(items){
			$scope.items = $scope.items.concat(items);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
  //console.log("params changed"+$scope.params);
  /*SendFactory.seturl('products','GET','');
  SendFactory.send()
  .then(function success(response){
    $scope.products=response.data;
  },function failure(response){
    console.log("failure");
  });
*/
}])

/********************************************************************************************/
.controller('CategoryCtrl',['$scope','SendFactory','$state','$rootScope','$ionicSideMenuDelegate',function($scope,SendFactory,$state,$rootScope,$ionicSideMenuDelegate){



    SendFactory.seturl('category','GET','');
    SendFactory.send()
    .then(function success(response){
        //console.log(response.data);
        $scope.groups=response.data;
    },function failure(response){
      console.log("failure");
    });

    $scope.clicked=function(id)
    {
      //console.log(id);
       $rootScope.$broadcast('someEvent', id);
      //  $rootScope.$broadcast('someEvents',true);
      if ($ionicSideMenuDelegate.isOpenLeft()) {
               $ionicSideMenuDelegate.toggleLeft();
            }
      //$scope.shownGroup = null;
      //$window.location.reload();
      // $state.go('app.single', {'productId':id});
      //$state.transitionTo('app.single', {'productId':id}, { reload: true});
    };

    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {

        $scope.shownGroup = group;
      //  console.log($scope.shownGroup);
      }
    };

    $scope.isGroupShown = function(group) {

      return $scope.shownGroup === group;
    };


}])

/********************************************************************************************/
//controller for the sign up function
.controller('SignupController',['$scope','$state','SendFactory','$ionicLoading','$ionicPopup','$timeout',function($scope,$state,SendFactory,$ionicLoading,$ionicPopup,$timeout){
console.log("haiii");
$scope.signup={};
$scope.Form={};
$scope.showAlert = function() {

var alertPopup = $ionicPopup.alert({
title: 'Instructions',
template: 'Username must contain only alphanumeric characters or <br> single hyphen/underscore,<br> & must begin or end with an alphabet',

});
alertPopup.then(function(res) {
console.log(45);
});

};
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
})
/********************************************************************************************/
.directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);
