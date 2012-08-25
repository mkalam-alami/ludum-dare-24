define(['consts', 'wan-components', 'tiledLevel', 'player', 'objects', 'cells'], function(consts) {
  
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
        c.scene('game');
      }
    });
    c.scene('game', function() {
      c.e('TiledLevel').tiledLevel('level' + gameState.currentLevel + '.json', consts.RENDER);
    });
    
    c.scene('endgame', function() {
      c.e('2D, DOM, Text, GameOver')
        .attr({x: 0, y: $stage.height()/2 - 50, w: $stage.width() - 80, h: 40})
        .text('Congratulations, you finished the game.<br />It was awesome, right?');
      c.e('2D, DOM, Text, MessageCentered')
        .attr({x: 0, y: $stage.height() - 50, w: $stage.width(), h: 40})
        .text('<a href=".">Restart?</a>');
    });
    
    c.scene('nextLevel');
      
  }

});
