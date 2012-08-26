define(['consts', 'wan-components', 'tiledLevel', 'player', 'objects', 'cells', 'cutscenes'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }
    
    var gameState = {
      currentLevel: consts.START_LEVEL - 1
    };

    // Game scenes
    c.scene('nextLevel', function() {
      gameState.currentLevel++;
      if (gameState.currentLevel > consts.LEVEL_COUNT) {
        c.scene('endgame');
      }
      else {
        c.scene('startLevel');
      }
    });
    c.scene('startLevel', function() {
      c.e('TiledLevel').tiledLevel('level' + gameState.currentLevel + '.json', consts.RENDER);
    });
    
    c.scene('menu');
    //c.scene('intro');
      
  }

});
