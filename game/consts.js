var gameState = {
  currentLevel: 1,
  mute: false,
  readMessages: {} // TODO
};

define([], function() {

  return {

    WIDTH: 768,
    HEIGHT: 576,
    
    RENDER: 'Canvas',

    GRAVITY: 0.8,
    TILE_SIZE: 48,
    LEVEL_COUNT: 6,
    START_LEVEL: 1,
    
    ASSETS: {
      CELL_NORMAL: 'img/entities/cell-normal.png',
      CELL_JUMP: 'img/entities/cell-jump.png',
      
      CELL_HALO: 'img/entities/cell-halo.png',
      
      HERO_CELL: 'img/entities/hero-cell.png',
      HERO_CELL_CORE: 'img/entities/hero-cell-core.png',
      
      STANDARD_SPRITESHEET: 'img/tiles/standard.png',
      OBJECTS_SPRITESHEET: 'img/tiles/objects.png',
      
      ILLUS1: 'img/illus/1.png',
      ILLUS2: 'img/illus/2.png',
      TEXT1: 'img/illus/text1.png',
      TEXT2: 'img/illus/text2.png',
      
      LOGO: 'img/gui/logo.png',
      GUISKIP: 'img/gui/skip.png',
      LEFTRIGHT: 'img/gui/leftright.png',
      UPDOWN: 'img/gui/updown.png',
      ESCAPE: 'img/gui/escape.png'
    },
    
    SOUNDS: {
      START: {
        ID: 'start',
        URL: 'sound/start.mp3'
      },
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
      }
    }
    
  };

});