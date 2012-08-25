define(['consts', 'wan-components'], function(consts) {



c.c('Player', {
  
  ACCELERATION: 0.9,
  BOUNCING: 0.3,
  FRICTION: 0.85,
  JUMP: 7,

  init: function() {
    this.addComponent('Image, Keyboard, Canvas, Collision');
    this.image('img/entities/hero-cell.png');
    this.attr({w: consts.TILESIZE, h: consts.TILESIZE});
    this.origin(this.w/2, this.w/2);
    
    var circle = new Crafty.circle(0, 0, this.w/2);
    circle.shift(this.w/2, this.w/2);
    this.collision(circle);
    
    this.bind('EnterFrame', this._enterFrame);
    this.onHit('Wall', this._hitWall);
    this.onHit('Ramp', this._hitRamp);
    this.xSpeed = 0;
    this.ySpeed = 0;
  },
  
  _enterFrame: function(e) {
    if (this.isDown('LEFT_ARROW')) {
      this.xSpeed -= this.ACCELERATION;
    }
    if (this.isDown('RIGHT_ARROW')) {
      this.xSpeed += this.ACCELERATION;
    }
    if (this.isDown('UP_ARROW') && this.onFloor) {
      this.ySpeed = -this.JUMP;
    }
    this.xSpeed *= this.FRICTION;
    
    if (!this.onFloor) {
      this.ySpeed += consts.GRAVITY;
    }
    this.onFloor = false;
    
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.rotation += this.xSpeed;
  },
  
  _hitWall: function(e) {
    _.each(e, function(collision) {
      // If top almost reached, consider it a floor
      if (collision.normal.x != 0 && collision.obj.y - this.y > this.h - 30) {
        collision.normal = {x: 0, y: -1};
        this.xSpeed *= .8;
      }
  
      // Walls
      if (collision.normal.x == -1) {
        this.xSpeed *= -this.BOUNCING;
        if (collision.overlap < 1) {
          this.x += collision.overlap;
        }
      }
     else if (collision.normal.x == 1) {
      this.xSpeed *= -this.BOUNCING;
      if (collision.overlap < 1) {
        this.x -= collision.overlap;
      }
     }
     
     // Floor
     else if (collision.normal.y == -1) {
      this.onFloor = true;
      this.ySpeed *= -this.BOUNCING;
      if (collision.overlap < 1) {
        this.y += collision.overlap;
      }
     }
     
     // Ceiling
     else if (collision.normal.y == 1) {
      this.ySpeed = 0;
      if (collision.overlap < 1) {
        this.y -= collision.overlap;
      }
     }
     
    }, this);
  },
  
  _hitRamp: function(e) {
    _.each(e, function(collision) {
       this.onFloor = true;
       this.x -= collision.normal.x * collision.overlap;
       this.y -= collision.normal.y * collision.overlap;
       this.xSpeed *= 1.1;
    }, this);
  }
});

c.c('Wall', {
  
  MARGIN: 1,

  init: function() {
    this.addComponent('Collision');
    this.attr({w: consts.TILESIZE, h: consts.TILESIZE});
    this.collision([this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.MARGIN],
      [this.w-this.MARGIN,this.w-this.MARGIN],
      [this.MARGIN,this.w-this.MARGIN]);
  }
  
});

c.c('LeftRamp', {

  init: function() {
    this.addComponent('Ramp, Collision');
    this.attr({w: consts.TILESIZE, h: consts.TILESIZE});
    this.collision([48,0], [48,48], [0,48]);
  }
  
});

c.c('RightRamp', {

  init: function() {
    this.addComponent('Ramp, Collision');
    this.attr({w: consts.TILESIZE, h: consts.TILESIZE});
    this.collision([0,0], [48,48], [0,48]);
  }
  
});

});