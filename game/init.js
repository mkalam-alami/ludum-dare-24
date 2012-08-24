requirejs.config({
    baseUrl: 'game',
    paths: {
        lib: '../lib'
    }
});


requirejs(['lib/underscore',
    'lib/crafty',
    'lib/jquery',
    'lib/jquery.json',
    'lib/jstorage',
    'lib/inheritance',
    'wan-components'
  ], function() {

  require(['game'], function(game) {
    game.run();
  });

});
