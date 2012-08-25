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
        console.log('level1.json loaded');
      });
    });
    
    c.scene('game');
      
  }

});
