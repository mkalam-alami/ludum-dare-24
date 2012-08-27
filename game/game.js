define(['consts', 'wan-components', 'tiledLevel', 'player', 'objects', 'cells', 'cutscenes', 'menu'], function(consts) {
  
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
        // Party hard!
        gameState.mute = false;
        soundManager.unmute();
        music = soundManager.getSoundById(consts.SOUNDS.MUSIC_KITTENS.ID);
      }
      if (music.playState == 0) {
        music.play();
      }
      
      if (gameState.currentLevel == 6) {
        c.scene('scriptmidgame');
      }
      else {
        c.e('TiledLevel').tiledLevel('level' + gameState.currentLevel + '.json', consts.RENDER);
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
