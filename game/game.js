define(['consts', 'wan-components', 'tiledLevel', 'player'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }

    // Game scene
    c.scene('game', function() {
    
      Crafty.e('TiledLevel').tiledLevel('level1.json', 'Canvas', function() {
      
      });
    
    });
      
    // Init Crafty
    $stage = $('#cr-stage');
    c.init($stage.width(), $stage.height());
    c.canvas.init();
    c.load(_.values(consts.ASSETS), function() {
      c.scene('game');
    });

  }

});
