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
.controller('ProductsCtrl',['$scope','SendFactory','$rootScope','$state','$ionicPopup','$templateCache','$window',function($scope,SendFactory,$rootScope,$state,$ionicPopup,$templateCache,$window){

  $scope.delete='delete';
  $scope.showlogo=true;
  $scope.add='add';
  $scope.remove='remove';
  $scope.searchform;
  $scope.numberOfItemsToDisplay=2;
  $rootScope.showcartempty=false;
  /******************************************/
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
             $scope.showlogo=false;
             console.log($scope.products);
             $scope.length=response.data.length;
             $scope.loadMore = function() {
                 if ($scope.length > $scope.numberOfItemsToDisplay)
                     $scope.numberOfItemsToDisplay +=1;
                     $scope.$broadcast('scroll.infiniteScrollComplete'); // load 20 more items
                     //done(); // need to call this when finish loading more data
                 };
           }
           else
           {
             $scope.show=false;
             $scope.showlogo=true;
           }
         },function failure(response){
            console.log("failure");
         });
     }
  });

  /******************************************/
  $scope.itemselected=function(data)
  {
     $scope.showsearch=true;
     $scope.productselected=data;
  };

  /******************************************/
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
                 $scope.showlogo=true;
               });
               //adding an item increases cart count
               if(response.data=='Item added to your cart')
                 $window.localStorage['cartlength']=parseInt($window.localStorage['cartlength'])+1;

            }
            else
            {
              $state.transitionTo('app.login', {},{reload: true, inherit: true, notify: true });
            }
     },function failure(response){
        console.log("failure");
     });
  };
/******************************************/
  $scope.movetocart=function(){
    SendFactory.seturl('products/displaycart','GET');
    SendFactory.send()
    .then(function success(response){
           if(response.data!='error'&& response.data !='empty')
           {
             $rootScope.cartproducts=response.data;
             $rootScope.showcartempty=false;
             $window.localStorage['cartproducts']=$scope.cartproducts;
             $window.localStorage['cartlength']=$scope.cartproducts.length;
           }
           else if (response.data=='empty')
           {
               $rootScope.cartproducts=[];
               $rootScope.showcartempty=true;
               $window.localStorage['cartlength']=0;
           }
           else
           {
             $state.transitionTo('app.login', {},{reload: true, inherit: true, notify: true });
           }
    },function failure(response){
       console.log("failure");
    });

  };

  /******************************************/
  $scope.altercart=function(state,pdtid,quantity)
  {

        $scope.data={action:state,id:pdtid,quantity:quantity};
        console.log($scope.data);
        SendFactory.seturl('products/altercart','POST',$scope.data);
        SendFactory.send()
        .then(function success(response){
           console.log(response);
           if(response.data=='success')
           {
            $scope.movetocart();
           }

           else
           {
             $ionicPopup.alert({
                title: 'Online Shopping site',
                template: 'Sorry...The product is out off stock....',
                okText:'Okay!'
              });
           }

         },function failure(response){
           console.log("failure");
        });

  };

 /******************************************************************************************/
 $scope.onsearchpress=function(){

   SendFactory.seturl('products/search','POST',$scope.searchform);
   SendFactory.send()
   .then(function success(response){
      //console.log(response.data);
      if(response.data!='error')
      {
         $scope.products=response.data;
           $scope.searchform.search="";
         console.log($scope.products);
         $scope.show=true;
         $scope.numberOfItemsToDisplay=2;
         $scope.length=response.data.length;
         $scope.loadMore = function() {
             if ($scope.length > $scope.numberOfItemsToDisplay)
                 $scope.numberOfItemsToDisplay +=1;
                 $scope.$broadcast('scroll.infiniteScrollComplete'); // load 20 more items
                 //done(); // need to call this when finish loading more data
             };

      }
      else
      {
        $ionicPopup.alert({
           title: 'Online Shopping site',
           template: 'No match found...Refine your search',
           okText:'Okay!'
         }).then(function(res) {
           $scope.productselected="";
           $scope.products="";
           $scope.showsearch=false;
           $scope.searchform.search="";
         });
          $scope.showlogo=true;
      }
    },function failure(response){
      console.log("failure");
   });

 };
/*******************************************************************************/
$scope.displaycount=function()
{
$scope.cartlength= $window.localStorage['cartlength'];
return $scope.cartlength;
};


}])
/********************************************************************************************/
.controller('CartCtrl',['$scope','$rootScope','$stateParams' ,function($scope, $rootScope,$stateParams) {
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
         $state.transitionTo('app.products', {},{reload: true, inherit: true, notify: true });
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
