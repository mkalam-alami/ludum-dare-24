define(['consts', 'wan-components', 'tiledMap', 'player', 'objects', 'cells', 'cutscenes', 'menu'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }

    // Game scenes
    c.scene('nextLevel', function() {
      if (gameState.currentLevel == "kittens") {
        gameState.currentLevel = consts.LEVEL_COUNT;
        c.scene('menu');
      }
      else {
        gameState.currentLevel++;
        $.jStorage.set('gameState', gameState);
        if (gameState.currentLevel > consts.LEVEL_COUNT) {
          gameState.gameFinished = true;
          gameState.currentLevel = consts.LEVEL_COUNT; 
          $.jStorage.set('gameState', gameState);
          c.scene('endgame');
        }
        else {
          c.scene('startLevel');
        }
      }
    });
    c.scene('startLevel', function() {
      var music = soundManager.getSoundById(consts.SOUNDS.MUSIC_THEME1.ID);
      if (gameState.currentLevel == "kittens") {
        music = soundManager.getSoundById(consts.SOUNDS.MUSIC_KITTENS.ID);
      }
      if (music.playState == 0) {
        music.play();
      }
      
      if (gameState.currentLevel == 7) {
        c.scene('scriptmidgame');
      }
      else {
        c.e('TiledMap').tiledMap('levels/level' + gameState.currentLevel + '.json', consts.RENDER);
      }
    });
    
    if (gameState.currentLevel > 1) {
      c.scene('menu');
    }
    else {
      c.scene('intro');
    }
      
  }

});
