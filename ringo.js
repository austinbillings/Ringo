angular.module('Ringo', [])
  .service('RingoService', function () {
    var service = {};

    service.defaults = function () {
      return {
        color: 'black',
        size: '50px',
        thickness: '2px'
      }
    }

    service.settings = service.defaults();

    service.removeExistingStyle = function () {
      var ex = document.getElementById('ringoStyle');
      if (ex) ex.remove();
    }

    service.replaceStyle = function () {
      service.removeExistingStyle();
      var css = service.ringoCss(service.settings);
      var tag = '<style id="ringoStyle">' + css + '</style>';
      angular.element(document).find('head').append(tag);
      console.log('put the tag', document.getElementById('ringoStyle'));
    }

    service.applySettings = function (settings) {
      if (!settings || typeof settings != 'object')
        return console.log('no settings to apply, dippin');
      if (settings.hasOwnProperty('size'))
        service.settings.size = settings.size;
      if (settings.hasOwnProperty('color'))
        service.settings.color = settings.color;
      if (settings.hasOwnProperty('thickness'))
        service.settings.thickness = settings.thickness;
      console.log('settings changed', service.settings)
    }

    service.initialize = function (settings) {
      console.log('initialized')
      if (settings) service.applySettings(settings);
      service.replaceStyle();
    }

    service.numberize = function (n) {
      return (n === n + 0 ? n : parseInt(n.toLowerCase().replace('px', '').trim()));
    }

    service.ringoCss = function (settings) {
      settings.size = service.numberize(settings.size);
      settings.thickness = service.numberize(settings.thickness);
      return '' +
        '@keyframes ringspin {' +
          '0% { transform: rotate(0deg); }' +
          '100% { transform: rotate(360deg); }' +
        '}' +
        'ringo {' +
          'background: none;' +
          'position: relative;' +
          'display: block;' +
          'margin: ' + (0.2 * settings.size) + 'px auto;' +
          'width: ' + settings.size + 'px;' +
          'height: ' + settings.size + 'px;' +
        '}' +
        'ringo inner {' +
          'position: absolute;' +
          'display: block;' +
          'width: ' + (0.8 * settings.size) + 'px;' +
          'height: ' + (0.8 * settings.size) + 'px;' +
          'top: ' + (0.1 * settings.size) + 'px;' +
          'left: ' + (0.1 * settings.size) + 'px;' +
          'border-radius: ' + (0.4 * settings.size) + 'px;' +
          'box-shadow: 0 ' + (settings.thickness) + 'px 0 0 ' + settings.color + ';' +
          'animation: ringspin 1s linear infinite;' +
        '}';
      }
    return service;
  })
  .directive('ringo', ['RingoService', function (RingoService) {
    return {
      scope: false,
      restrict: 'E',
      template: '<inner></inner>',
      link: function (scope, el, attrs) {
        RingoService.initialize();
      }
    };
  }]);