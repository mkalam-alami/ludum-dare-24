define(['consts'], function(consts) {

c.c('SceneFade', {

  init: function() {
    this.addComponent('2D, DOM, Tween, Persist')
      .attr({
        x: -c.viewport.x,
        y: -c.viewport.y,
        w: 1000,
        h: 1000,
        alpha: 0
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
    if (this.alpha > 0.5) {
        c.scene(this.targetScene);
        this.attr({x: 0, y: 0});
        c.viewport.x = c.viewport.y = 0;
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
  
  _endLevel: function(e) {
    if (!this.end && c('SceneFade').length == 0) {
      try {
        e[0].obj.disable();
      }
      catch (error) {
        console.error(error);
      } 
      c.e('SceneFade').sceneFade('nextLevel');
      this.end = true;
    }
  }

});

c.c('Wall', {
  
  MARGIN: 1,

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    //this.collision([0,0],[this.w,0],[this.w,this.h],[0,this.h]);
    this.collision([this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.w-this.MARGIN],
      [this.MARGIN,this.w-this.MARGIN]);
  }
  
 /* setup: function() {
    c.e('2D, Canvas, Text').text(this.i + '-' + this.j).attr({x:this.x+5, y:this.y+15});
  }*/
  
});

c.c('Dead', {

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    this.collision([0,0],[this.w,0],[this.w,this.h],[0,this.h]);
    this.onHit('Player', this._restartLevel);
    this.dead = false;
  },
  
  _restartLevel: function(e) {
    if (!this.dead) {
      this.dead = true;
      try {
        e[0].obj.die();
      }
      catch (error) {
        console.error(error);
      }
      c.e('SceneFade').sceneFade('startLevel');
    }
  }

});


c.c('IngameMessageAbstract', {
  init: function() {
    this.addComponent('2D, ' + consts.RENDER + ', Tween');
    this.bind('TweenEnd', this._tweenEndAbstract);
    this.bind('EnterFrame', this._enterFrameAbstract);
    this.attr({alpha: 0});
  },
  ingameMessageAbstract: function(delayms, initialSpeed) {
    this._delayms = delayms;
    this._xspeed = initialSpeed;
    this.tween({alpha: 1}, 40);
  },
  _tweenEndAbstract: function() {
    if (this._alpha > 0.5) {
      this.timeout(function() {
        this.tween({alpha: 0}, 30);
      }, this._delayms);
    }
    else {
      this.destroy();
    }
  },
  _enterFrameAbstract: function() {
    if (Math.abs(this._xspeed) > 0.1) {
      this.x += this._xspeed / 2;
      this._xspeed *= 0.95;
    }
  }
});

c.c('IngameMessageText', {
  init: function() {
    this.addComponent('IngameMessageAbstract, Text');
    this.textFont({ family: "'TVEFont', serif", size: '30pt' });
    this.textColor('#666666', 0.9);
  },
  ingameMessageText: function(text, delayms, initialSpeed) {
    this.ingameMessageAbstract(delayms, initialSpeed);
    this.text(text);
  }
});
  
c.c('IngameMessageImage', {
  init: function() {
    this.addComponent('IngameMessageAbstract, Image');
  },
  ingameMessageImage: function(image, delayms, initialSpeed) {
    this.ingameMessageAbstract(delayms, initialSpeed);
    this.image(consts.ASSETS[image]);
  }
});

c.c('IngameMessage', {
  
  init: function() {
    this.addComponent('2D, Collision');
  },
  
  ingameMessage: function(text, image, delayms) {
    this._text = text;
    this._image = image;
    this._delayms = delayms || 5000;
    this.collision([0,0],[this.w,0],[this.w,this.h],[0,this.h]);
    this.onHit('Player', this._displayMessageAndDie);
  },
  
  _displayMessageAndDie: function(e) {
    if (this._text) {
      c.e('IngameMessageText')
        .attr({x: this.x, y: this.y})
        .ingameMessageText(this._text, this._delayms, e[0].obj.xSpeed);
    }
    if (this._image) {
      var yOffset = 0;
      if (this._text) {
        yOffset = 20;
      }
      c.e('IngameMessageImage')
        .attr({x: this.x, y: this.y + yOffset})
        .ingameMessageImage(this._image, this._delayms, e[0].obj.xSpeed);
    }
    this.destroy();
  }
  
});


c.c('IngameImage', {
  init: function() {
    this.addComponent('2D, ' + consts.RENDER + ', Image');
  },
  ingameImage: function(assetId) {
    this.image(consts.ASSETS[assetId]);
  }
});

});