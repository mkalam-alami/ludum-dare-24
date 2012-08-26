define(['consts', 'wan-components', 'tiledLevel', 'player', 'objects', 'cells', 'cutscenes', 'menu'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }

    // Game scenes
    c.scene('nextLevel', function() {
      gameState.currentLevel++;
      $.jStorage.set('gameState', gameState);
      if (gameState.currentLevel > consts.LEVEL_COUNT) {
        c.scene('endgame');
      }
      else {
        c.scene('startLevel');
      }
    });
    c.scene('startLevel', function() {
      var music = soundManager.getSoundById(consts.SOUNDS.MUSIC_THEME1.ID);
      if (music.playState == 0) {
        music.play();
      }
    
      c.e('TiledLevel').tiledLevel('level' + gameState.currentLevel + '.json', consts.RENDER);
    });
    
    c.scene('menu');
    //c.scene('intro');
      
  }

});
