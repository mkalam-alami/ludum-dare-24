define(['consts', 'wan-components'], function(consts) {

c.c('Player', {
  
  ACCELERATION: 1.5,
  BOUNCING: 0.4,
  FRICTION: 0.85,
  JUMP_TABLE: [9, 15, 19, 25], // TODO

  init: function() {
    this.addComponent('Image, Keyboard, Canvas, Collision');
    //this.image('img/entities/hero-cell.png');
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    
    c.viewport.centerOn(this); // FIXME
    
    this.bind('EnterFrame', this._enterFrame);
    this.onHit('Wall', this._hitWall);
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.jumping = false;
    this.collisions = {};
    this.i = this.j = 0;
    
    // Appearance
    this.bodySize = 1;
    this.vertical = false;
    this.sprites = [];
    this.attachedCells = [this]; // {index:X , cell:X} (if null, true body)
    this.refresh();
  },
  
  refresh: function() {
    // Reset sprites
    _.each(this.sprites, function(sprite) {
      sprite.destroy();
    });
    this.sprites = [];
    
    // Update collision polygon & shape
    if (this.bodySize == 1) {
      var circle = new Crafty.circle(0, 0, this.w/2);
      circle.shift(this.w/2, this.w/2);
      this.collision(circle);
      this.origin(this.w/2, this.w/2);
    }
    else {
      this.rotation = 0;
      var ww = consts.TILE_SIZE*this.bodySize;
      this.attr({w: ww, h: consts.TILE_SIZE});
      this.collision([0,0], [ww,0], [ww,this.h], [0,this.h]);
    }
    
    // Create new ones
    var newSprite = null, i = 0;
    _.each(this.attachedCells, function(cell) {
      var spriteId = 2;
      if (this.bodySize == 1) {
        spriteId = 0;
      }
      else if (i == 0) {
        spriteId = 1;
      }
      else if (i == this.attachedCells.length - 1) {
        spriteId = 3;
      }
      if (cell == this) {
        newSprite = c.e('2D, ' + consts.RENDER + ', cellHero' + spriteId)
          .attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE, x: (i++ * 48), y: 0, z: 100});
        this.attach(newSprite);
        console.log(newSprite);
      }
      else {
        newSprite = c.e('2D, ' + consts.RENDER + ', cellNormal' + spriteId)
          .attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE, x: (i++ * 48), y: 0, z: 100});
        this.attach(newSprite);
        console.log(newSprite);
      }
      if (newSprite != null) {
        this.sprites.push(newSprite);
      }
      else {
        console.error("No sprite for " + cell);
      }
    }, this);
    
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
      if (this.isDown('UP_ARROW') && !this.jumping && this.collisions.hitFloor
          && !this.collisions.hitCeiling && !this.level[this.i][this.j-1]) {
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
    if (this.bodySize == 1) {
      this.rotation += (this.x - this.prevX) * 2;
    }
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