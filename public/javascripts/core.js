var reportApp = angular.module('reportApp', []);



reportApp.controller('mainController', function($scope, $attrs) {
    $scope.test = 'yoyo';
    $scope.validation = false;
});