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
  ], function() {

  require(['game'], function(game) {
    $(document).ready(function() {
      game.run();
    });
  });

});
