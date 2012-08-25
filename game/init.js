requirejs.config({
    baseUrl: 'game',
    paths: {
        lib: '../lib'
    }
});

// Load minimal libraries
requirejs(['lib/jquery', 'lib/crafty'], function() {

  c = Crafty;

  // Init Crafty and display loading screen
  $stage = $('#cr-stage');
  c.init($stage.width(), $stage.height());
  c.canvas.init();
  
  c.scene('loadjs', function() {
    c.e('2D, DOM, Text, LoadingMessage')
      .attr({x: 0, y: $stage.height()/2 - 20, w: $stage.width(), h: 40})
      .text('Loading libraries...');
  });
  c.scene('loadjs');
  
  // Load remaining libraries & game entry point
  require(['lib/underscore',
    'lib/crafty',
    'lib/jquery',
    'lib/jquery.json',
    'lib/jstorage',
    'lib/inheritance'], function() {
    
    require(['consts', 'game'], function(consts, game) {
      // Assets loading & loading screen
      c.scene('loadassets', function() {
        assetsLoadBaseText = "Loading assets: ";
        var assetsLoadText = c.e('2D, DOM, Text, LoadingMessage')
          .attr({x: 0, y: $stage.height()/2 - 20, w: $stage.width(), h: 40})
          .text(assetsLoadBaseText + "<b>0%</b>");
        c.load(_.values(consts.ASSETS), function() {
          // Register sprites
          function cellMap(s) {
            var o = {};
            for (var i = 0; i < 4; i++) {
              o[s+i] = [i, 0];
            }
            return o;
          }
          
          Crafty.sprite(48, 48, consts.ASSETS.HERO_CELL, cellMap("CellHero"));
          Crafty.sprite(48, 48, consts.ASSETS.CELL_NORMAL, cellMap("CellNormal"));
          
          // Launch game
          game();
        },
        function(e) {
          assetsLoadText.text(assetsLoadBaseText + "<b>" + Math.floor(e.percent) + "%</b>");
        });
      });
      c.scene('loadassets');
    });
    
  });

});
