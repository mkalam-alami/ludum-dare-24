define(['lib/jquery'], function() {

  return {

    WIDTH: $('#cr-stage').width(),
    HEIGHT: $('#cr-stage').height(),
    
    RENDER: 'Canvas',

    GRAVITY: 0.8,
    TILE_SIZE: 48,
    LEVEL_COUNT: 5,
    START_LEVEL: 5,
    
    ASSETS: {
      CELL_NORMAL: 'img/entities/cell-normal.png',
      CELL_JUMP: 'img/entities/cell-jump.png',
      
      CELL_HALO: 'img/entities/cell-halo.png',
      
      HERO_CELL: 'img/entities/hero-cell.png',
      HERO_CELL_CORE: 'img/entities/hero-cell-core.png',
      
      STANDARD_SPRITESHEET: 'img/tiles/standard.png',
      OBJECTS_SPRITESHEET: 'img/tiles/objects.png'
    }
    
  };

});