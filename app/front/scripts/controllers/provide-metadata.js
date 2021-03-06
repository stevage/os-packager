;(function(angular, undefined) {

  angular.module('Application')
    .controller('ProvideMetadataController', [
      '$scope', 'PackageService', 'ProvideMetadataService',
      'ApplicationLoader', '_',
      function($scope, PackageService, ProvideMetadataService,
        ApplicationLoader, _) {
        ApplicationLoader.then(function() {
          $scope.forms = _.extend({}, $scope.forms);

          $scope.geoData = ProvideMetadataService.getGeoData();
          $scope.state = ProvideMetadataService.getState();

          $scope.attributes = PackageService.getAttributes();

          var fiscalPeriod = null;
          if ($scope.attributes && $scope.attributes.fiscalPeriod) {
            fiscalPeriod = $scope.attributes.fiscalPeriod;
          }
          $scope.period = {
            start: fiscalPeriod ? fiscalPeriod.from : '',
            end: fiscalPeriod ? fiscalPeriod.to : '',
          };

          $scope.$watch('attributes.title', function() {
            if ($scope.attributes) {
              ProvideMetadataService.updatePackageName();
            }
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          });

          $scope.$watch('period', function(value) {
            ProvideMetadataService.updateFiscalPeriod(value);
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          }, true);

          $scope.$watch('attributes.regionCode', function() {
            ProvideMetadataService.updateCountries();
            $scope.geoData = ProvideMetadataService.getGeoData();
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          });

          $scope.$watch('attributes', function(newValue, oldValue) {
            if ((newValue === oldValue)) {
              return;
            }
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          }, true);
        });
      }
    ]);

})(angular);
