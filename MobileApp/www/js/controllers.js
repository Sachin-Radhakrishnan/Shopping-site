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
/********************************************************************************************/
//controller for the login function
.controller('LoginController',['$scope','$state','SendFactory','$ionicLoading','$ionicPopup','$timeout','$window',function($scope,$state,SendFactory,$ionicLoading,$ionicPopup,$timeout,$window){

  $scope.login={};
  $scope.Form={};
  $scope.showAlert = function() {

  var alertPopup = $ionicPopup.alert({
  title: 'Instructions',
  template: 'Username must contain only alphanumeric characters or <br> single hyphen/underscore,<br> & must begin or end with an alphabet',

  });
  alertPopup.then(function(res) {
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

        SendFactory.seturl('login','POST',$scope.login);
        SendFactory.send()
        .then(function success(response)
        {
          console.log(response);
          $window.localStorage['token']=response.data.token;
          console.log($window.localStorage['token']);

          $ionicLoading.hide();
          //clear the form
          $scope.login={};
          $scope.Form.LoginForm.$setPristine();
          $scope.Form.LoginForm.$setUntouched();
          $state.transitionTo('app.products', {}, { reload: true, inherit: true, notify: true });


        },function failure(response)
        {

          $window.localStorage.removeItem('token');
          $ionicLoading.hide();
          $ionicLoading.show({
              template: 'Unauthorized User',
              scope: $scope
            });
           $timeout(function() {
               $ionicLoading.hide();
           }, 2000);
        });
  };

}])

/********************************************************************************************/
.controller('ProductsCtrl',['$scope','SendFactory','$rootScope','$state','$ionicPopup','$templateCache',function($scope,SendFactory,$rootScope,$state,$ionicPopup,$templateCache){

 $rootScope.$on('someEvent', function(mass, data) {
     $scope.showsearch=false;
     if(data!=null)
     {
         $scope.catid={id:data};
         $scope.show=true;
         $scope.numberOfItemsToDisplay=2;
         SendFactory.seturl('products','POST',$scope.catid);
         SendFactory.send()
         .then(function success(response){
           if(response.data!='error')
           {
             $scope.products=response.data;
             console.log($scope.products);
             $scope.length=response.data.length;
             $scope.loadMore = function() {
                 if ($scope.length > $scope.numberOfItemsToDisplay)
                     $scope.numberOfItemsToDisplay +=1;
                     $scope.$broadcast('scroll.infiniteScrollComplete'); // load 20 more items
                     //done(); // need to call this when finish loading more data
                 }
           }
           else
           {
             $scope.show=false;
           }
         },function failure(response){
            console.log("failure");
         });
     }
  });

  $scope.itemselected=function(data)
  {
     $scope.showsearch=true;
     $scope.productselected=data;
  };

  $scope.addtocart=function(data)
  {
     $scope.pdtid={id:data};
     SendFactory.seturl('products/addtocart','POST',$scope.pdtid);
     SendFactory.send()
     .then(function success(response){
            if(response.data!='error')
            {
              $ionicPopup.alert({
                 title: 'Online Shopping site',
                 template: response.data,
                 okText:'Okay!'
               }).then(function(res) {
                 $scope.productselected="";
                 $scope.products="";
                 $scope.showsearch=false;
               });

            }
            else
            {
              $state.transitionTo('app.login', {},{reload: true, inherit: true, notify: true });
            }
     },function failure(response){
        console.log("failure");
     });
  };


}])
/********************************************************************************************/
.controller('ProductCtrl',['$scope','$rootScope','$stateParams' ,function($scope, $rootScope,$stateParams) {
console.log($rootScope.abc);
  $scope.$on('SOME_TAG', function(response) {

 });




}])
/********************************************************************************************/
.controller('CategoryCtrl',['$scope','SendFactory','$state','$rootScope','$ionicSideMenuDelegate',function($scope,SendFactory,$state,$rootScope,$ionicSideMenuDelegate){

    SendFactory.seturl('category','GET','');
    SendFactory.send()
    .then(function success(response){
        $scope.groups=response.data;
    },function failure(response){
      console.log("failure");
    });

    $scope.clicked=function(id)
    {
       $rootScope.$broadcast('someEvent', id);
       //toggle menu
      if ($ionicSideMenuDelegate.isOpenLeft()) {
               $ionicSideMenuDelegate.toggleLeft();
            }
      //$scope.shownGroup = null;
    };

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group))
        {
          $scope.shownGroup = null;
        }
        else
        {
          $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };


}])

/********************************************************************************************/
//controller for the sign up function
.controller('SignupController',['$scope','$state','SendFactory','$ionicLoading','$ionicPopup','$timeout',function($scope,$state,SendFactory,$ionicLoading,$ionicPopup,$timeout){

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
.directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.go(-1);
                });
            }
        };
    }]);
/*********************************************************************************************/
