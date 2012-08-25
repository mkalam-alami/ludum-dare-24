define(['wan-components', 'tiledLevel', 'player'], {
  
  run: function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }

    // Game scene
    c.scene('game', function() {
    
      Crafty.e('TiledLevel').tiledLevel('./levels/1.json', 'Canvas', function() {
      
      });
    
    });
      
    // Init Crafty
    $stage = $('#cr-stage');
    c.init($stage.width(), $stage.height());
    c.canvas.init();
    c.scene('game');

  }

});
