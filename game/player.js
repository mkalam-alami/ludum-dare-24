define(['consts', 'wan-components'], function(consts) {



c.c('Player', {
  
  ACCELERATION: 1.2,
  BOUNCING: 0.4,
  FRICTION: 0.85,
  JUMP_TABLE: [7],

  init: function() {
    this.addComponent('Image, Keyboard, Canvas, Collision');
    this.image('img/entities/hero-cell.png');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    this.origin(this.w/2, this.w/2);
    
    c.viewport.centerOn(this);
    
    var circle = new Crafty.circle(0, 0, this.w/2);
    circle.shift(this.w/2, this.w/2);
    this.collision(circle);
    
    this.bind('EnterFrame', this._enterFrame);
    this.onHit('Wall', this._hitWall);
    this.onHit('Ramp', this._hitRamp);
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.collisions = {};
    this.i = this.j = 0;
    
    this.jumping = false;
    this.bodySize = 1;
  },
  
  _enterFrame: function(e) {
    // Handle collisions
    if (this.collisions.hitFloor && !this.collisions.hitCeiling) {
      this.i = this.collisions.hitFloor.obj.i;
      this.j = this.collisions.hitFloor.obj.j - 1;
      // Floor
      if (Math.abs(this.collisions.hitFloor.overlap) > 1) {
        this.y -= Math.abs(this.collisions.hitFloor.overlap) / 2;
      }
      else {
        this.ySpeed = 0;
      }
      this.ySpeed *= -this.BOUNCING;
      // Fall from edges
      if (this.x - this.collisions.hitFloor.obj.x > 30
        && (!this.level[this.i+1] || !this.level[this.i+1][this.j+1]) && Math.abs(this.xSpeed) < 3) {
        this.xSpeed++;
      }
      if (this.x - this.collisions.hitFloor.obj.x < -30
        && (!this.level[this.i-1] || !this.level[this.i-1][this.j+1]) && Math.abs(this.xSpeed) < 3) {
        this.xSpeed--;
      }
    }
    else if (!this.collisions.hitFloor && this.collisions.hitCeiling) {
      // Ceiling
      this.ySpeed *= -this.BOUNCING;
      this.y -= this.collisions.hitCeiling.overlap / 2;
    }
    if (this.collisions.hitLeftWall && !this.collisions.hitRightWall) {
      // Left wall
      this.xSpeed *= this.FRICTION;
      this.x -= this.collisions.hitLeftWall.overlap;
    }
    else if (!this.collisions.hitLeftWall && this.collisions.hitRightWall) {
      // Right wall
      this.xSpeed *= this.FRICTION;
      this.x += this.collisions.hitRightWall.overlap;
    }
    else if (this.collisions.hitLeftWall && this.collisions.hitRightWall) {
      // Vertical "tube"
      this.xSpeed = 0;
    }
    
    // Handle physics
    if (!this.collisions.hitFloor) {
      this.ySpeed += consts.GRAVITY;
    }
    else if (this.jumping) {
      this.jumping = false;
    }
    if (!this.jumping) {
      this.xSpeed *= this.FRICTION;
    }
    
    // Handle controls
    if (!this.jumping) {
      if (this.isDown('LEFT_ARROW') && !this.collisions.hitLeftWall) {
        this.xSpeed -= this.ACCELERATION;
      }
      if (this.isDown('RIGHT_ARROW') && !this.collisions.hitRightWall) {
        this.xSpeed += this.ACCELERATION;
      }
      console.log(this.level[this.i][this.j-1]);
      if (this.isDown('UP_ARROW') && !this.jumping
        && this.collisions.hitFloor && !this.collisions.hitCeiling && !this.level[this.i][this.j-1]) {
        if (this.isDown('LEFT_ARROW')) {
          this.xSpeed = -5;
        }
        if (this.isDown('RIGHT_ARROW')) {
          this.xSpeed = 5;
        }
        this.ySpeed = -this.JUMP_TABLE[this.bodySize - 1];
        this.jumping = true;
      }
    }
    
    // Update position/rotation
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.rotation += (this.x - this.prevX) * 2;
    this.prevX = this.x;
    this.prevY = this.y;
    
    this.collisions = {};
  },
  
  _hitWall: function(e) {
    // Collisions lookup object: hitFloor, hitCeiling, hitLeftWall, hitRightWall
    
    _.each(e, function(collision) {
      if (collision.normal.x == 1) {
        this.collisions.hitLeftWall = collision;
      }
      else if (collision.normal.x == -1) {
        this.collisions.hitRightWall = collision;
      }
      else if (collision.normal.y == -1) {
        this.collisions.hitFloor = collision;
      }
      else if (collision.normal.y == 1) {
        this.collisions.hitCeiling = collision;
      }
    }, this);
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