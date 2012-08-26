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
      
      GUISKIP: 'img/gui/skip.png'
    }
    
  };

});