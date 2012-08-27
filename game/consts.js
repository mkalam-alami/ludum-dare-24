var gameState = {
  currentLevel: 1,
  mute: false,
  gameFinished: false,
  resetSave: false
};


define([], function() {

  return {

    WIDTH: 768,
    HEIGHT: 576,
    
    RENDER: 'Canvas',

    GRAVITY: 0.8,
    TILE_SIZE: 48,
    LEVEL_COUNT: 9,
    
    MUSIC_VOLUME: 75,
    
    ASSETS: {
      CELL_NORMAL: 'img/entities/cell-normal.png',
      CELL_JUMP: 'img/entities/cell-jump.png',
      CELL_COMPANION: 'img/entities/cell-companion.png',
      
      CELL_HALO: 'img/entities/cell-halo.png',
      
      HERO_CELL: 'img/entities/hero-cell.png',
      HERO_CELL_CORE: 'img/entities/hero-cell-core.png',
      
      STANDARD_SPRITESHEET: 'img/tiles/standard.png',
      OBJECTS_SPRITESHEET: 'img/tiles/objects.png',
      
      ILLUS1: 'img/illus/1.png',
      ILLUS2: 'img/illus/2.png',
      TEXT1: 'img/illus/text1.png',
      TEXT2: 'img/illus/text2.png',
      TEXT3: 'img/illus/text3.png',
      
      LEVEL1: 'img/illus/level1.png',
      
      LOGO: 'img/gui/logo.png',
      GUISKIP: 'img/gui/skip.png',
      LEFTRIGHT: 'img/gui/leftright.png',
      UPDOWN: 'img/gui/updown.png',
      ESCAPE: 'img/gui/escape.png',
      MERGE: 'img/gui/merge.png',
      JUMP: 'img/gui/jump.png',
      RESET: 'img/gui/reset.png',
      ROTATE: 'img/gui/rotate.png'
    },
    
    SOUNDS: {
      START: { ID: 'start', URL: 'sound/start.mp3' },
      CHANGE: { ID: 'change', URL: 'sound/change.wav' },
      MERGE: { ID: 'merge', URL: 'sound/merge.wav' },
      JUMP1: { ID: 'jump1', URL: 'sound/jump1.wav' },
      JUMP2: { ID: 'jump2', URL: 'sound/jump2.wav' },
      JUMP3: { ID: 'jump3', URL: 'sound/jump3.wav' },
      MUSIC_THEME1: {
        ID: 'musictheme1',
        URL: 'sound/theme1.mp3'
      },
      MUSIC_MAINSCREEN: {
        ID: 'musicmainscreen',
        URL: 'sound/mainscreen.mp3'
      },
      MUSIC_CUTSCENES: {
        ID: 'musiccutscenes',
        URL: 'sound/cutscenes.mp3'
      },
      MUSIC_KITTENS: {
        ID: 'musickittens',
        URL: 'sound/nyan.mp3'
      }
    }
    
  };

});