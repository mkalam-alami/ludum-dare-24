define(['consts'], function(consts) {

c.c('SceneFade', {

  init: function() {
    this.addComponent('Tween, Persist')
      .attr({
        w: 1000,
        h: 1000,
        alpha: 0
      })
      .css({
        'background-color': 'black'
      })
      .bind('TweenEnd', this._tweenEnd);
  },
  
  sceneFade: function(toScene) {
    this.targetScene = toScene;
    this.tween({
      fadein: true,
      alpha: 1
    }, 50);
  },
    
  _tweenEnd: function(param) {
    if (this.alpha > 0.9) {
        c.scene(this.targetScene);
        this.tween({
          fadeout: true,
          alpha: 0
        }, 50);
    }
    else {
      this.destroy();
    }
  }

});

c.c('Finish', {

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    this.collision();
    this.onHit('Player', this._endLevel);
    this.end = false;
  },
  
  _endLevel: function() {
    if (!this.end) {
      c.e('Player').destroy();
      var blackBg = c.e('2D, DOM, SceneFade').sceneFade('nextLevel');
      this.end = true;
    }
  }

});

c.c('Wall', {
  
  MARGIN: 0,

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    this.collision([this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.w-this.MARGIN],
      [this.MARGIN,this.w-this.MARGIN]);
  }
  
});

});