requirejs.config({
    baseUrl: 'game',
    paths: {
        lib: '../lib'
    }
});

// Load minimal libraries
requirejs(['consts', 'lib/jquery', 'lib/crafty'], function(consts) {
  $(document).ready(function() {
  
  c = Crafty;

  // Init Crafty and display loading screen
  c.init(consts.WIDTH, consts.HEIGHT);
  if (consts.RENDER == 'Canvas') {
    c.canvas.init();
  }
  
  c.scene('loadjs', function() {
    c.e('2D, DOM, Text, LoadingMessage')
      .attr({x: 0, y: consts.HEIGHT/2 - 20, w: consts.WIDTH, h: 40})
      .text('Loading libraries...');
  });
  c.scene('loadjs');
  
  // Load remaining libraries & game entry point
  require(['lib/underscore',
    'lib/crafty',
    'lib/jquery.json',
    'lib/jstorage',
    'lib/inheritance',
    'lib/soundmanager2'], function() {
    
    // Load game state
    if (gameState.resetSave) {
      $.jStorage.set('gameState', null);
    }
    var newGameState = $.jStorage.get('gameState');
    if (newGameState) {
      gameState = newGameState;
    }
    
    require(['consts', 'game'], function(consts, game) {
    
      // Assets loading & loading screen
      c.scene('loadassets', function() {
        assetsLoadBaseText = "Loading graphics: ";
        var assetsLoadText = c.e('2D, DOM, Text, LoadingMessage')
          .attr({x: 0, y: consts.HEIGHT/2 - 20, w: consts.WIDTH, h: 40})
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
          
          c.sprite(48, 48, consts.ASSETS.HERO_CELL, cellMap("CellHero"));
          c.sprite(48, 48, consts.ASSETS.CELL_NORMAL, cellMap("CellNormal"));
          c.sprite(48, 48, consts.ASSETS.CELL_COMPANION, cellMap("CellCompanion"));
          c.sprite(48, 48, consts.ASSETS.CELL_GRAVITY, cellMap("CellGravity"));
          
          // Launch game
          game();
        },
        function(e) {
          assetsLoadText.text(assetsLoadBaseText + "<b>" + Math.floor(e.percent) + "%</b>");
        });
      });
    
      // Init sound and load mp3s
      c.scene('loadsounds', function() {
        soundsLoadBaseText = "Loading sounds: ";
        var soundCount = _.size(consts.SOUNDS), loadedSounds = 0;
        var soundLoadMessage = c.e('2D, DOM, Text, LoadingMessage')
          .attr({x: 0, y: consts.HEIGHT/2 - 20, w: consts.WIDTH, h: 40})
          .text(soundsLoadBaseText + "<b>0%</b>");
        _.each(consts.SOUNDS, function(sound) {
            var isMusic = sound.ID.indexOf('music') != -1;
            soundManager.createSound({
              id: sound.ID,
              url: sound.URL,
              loops: (isMusic) ? 999 : 0,
              volume: (isMusic) ? consts.MUSIC_VOLUME : 100,
              onload: function() {
                loadedSounds++;
                soundLoadMessage.text(soundsLoadBaseText + "<b>" + Math.floor(100 * loadedSounds / soundCount) + "%</b>");
                if (loadedSounds == soundCount) {
                  c.scene('loadassets');
                }
              }
            }).load();
        });
      });
      soundManager.setup({
        url: './sound/swf',
        preferFlash: true,
        onready: function() {
          c.scene('loadsounds');
        }
      });
      if (gameState.mute) {
        soundManager.mute();
      }
    
    });
    
  });
  
  });
});
