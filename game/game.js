define(['consts', 'wan-components', 'tiledLevel', 'player', 'objects', 'cells'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }
    
    var gameState = {
      currentLevel: 0
    };

    // Game scenes
    c.scene('nextLevel', function() {
      gameState.currentLevel++;
      if (gameState.currentLevel > consts.LEVEL_COUNT) {
        gameState.currentLevel = 1; // TODO Endgame
      }
      c.scene('game');
    });
    c.scene('game', function() {
      c.e('TiledLevel').tiledLevel('level' + gameState.currentLevel + '.json', consts.RENDER);
      c.viewport.clampToEntities = true;
      c.viewport.mouselook(true);
    });
    
    c.scene('nextLevel');
      
  }

});
