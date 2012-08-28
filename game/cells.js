define(['consts'], function(consts) {

c.c('Cell', {

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    
    var circle = new Crafty.circle(0, 0, 200);
    circle.shift(this.w/2, this.w/2);
    this.collision(circle);
    
    this.bind('EnterFrame', this._enterFrame);
    
    this.haloImage = consts.ASSETS.CELL_HALO;
  },
  
  _enterFrame: function(e) {
    var hit = this.hit('Player');
    if (hit && !this.halo) {
      this._onHitPlayer(hit[0].obj);
    }
    else if (!hit && this.halo) {
      this._onUnhitPlayer(this.player);
    }
  },
  
  _onHitPlayer: function(player) {
    // Remove halo from other cells
    _.each(c('Cell'), function(id) {
      var aCell = c(id);
      if (aCell[0] != this[0]) {
        aCell._onUnhitPlayer(player);
      }
    }, this);
    
    // Create halo
    this.halo = c.e('2D, DOM, Image, Halo')
      .image(this.haloImage)
      .attr({x: this.x - consts.TILE_SIZE/4,
        y: this.y - consts.TILE_SIZE/4,
        w: consts.TILE_SIZE*3/2,
        h: consts.TILE_SIZE*3/2,
        z: 0
      });
    this.attach(this.halo);
    this.player = player;
    this.player.targetCell = this;
  },
  
  _onUnhitPlayer: function() {
    if (this.player) {
      this.player.targetCell = null;
    }
    if (this.halo) {
      this.detach(this.halo);
      this.halo.destroy();
      this.halo = null;
    }
  }
  
  
});

c.c('CellNormal', {
  init: function() {
    this.addComponent('CellNormal0, Cell');
  }
});

c.c('CellCompanion', {
  init: function() {
    this.addComponent('CellCompanion0, Cell');
  }
});

c.c('CellJump', {
  init: function() {
    this.addComponent('Cell, Image');
    this.image(consts.ASSETS.CELL_JUMP);
    this.origin(this.w/2, this.h/2);
    this.bind('EnterFrame', this._enterFrameJump);
    this.rotationSpeed = 2;
  },
  _enterFrameJump: function() {
    this.rotation += this.rotationSpeed;
  },
  attached: function() {
    this.unbind('EnterFrame', this._enterFrame);
    this.rotationSpeed = -4;
    this._onUnhitPlayer();
  }
});


});
