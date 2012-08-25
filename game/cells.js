define(['consts'], function(consts) {

c.c('CellNormal', {

  init: function() {
    this.addComponent('cellNormal0, Collision, Cell');
    
    var circle = new Crafty.circle(0, 0, this.w * 5);
    circle.shift(this.w/2, this.w/2);
    this.collision(circle);
    
    this.bind('EnterFrame', this._enterFrame);
  },
  
  _enterFrame: function(e) {
    var player = this.hit('Player');
    if (player && !this.halo) {
      this._onHitPlayer(player);
    }
    else if (!player && this.halo) {
      this._onUnhitPlayer();
    }
  },
  
  _onHitPlayer: function(e) {
    e[0].obj.targetCell = this;
    
    // Remove halo from other cells
    _.each(c('Cell'), function(id) {
      var aCell = c(id);
      if (aCell != this) {
        aCell._onUnhitPlayer();
      }
    }, this);
    
    // Create halo
    if (!this.halo) {
      this.halo = c.e('2D, DOM, Image')
        .image(consts.ASSETS.CELL_HALO)
        .attr({x: this.x - consts.TILE_SIZE/4,
          y: this.y - consts.TILE_SIZE/4,
          w: consts.TILE_SIZE*3/2,
          h: consts.TILE_SIZE*3/2
        });
      this.attach(this.halo);
    }
  },
  
  _onUnhitPlayer: function(e) {
    if (this.halo) {
      this.halo.destroy();
      this.halo = null;
    }
  }
  
  
});

});