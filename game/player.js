define(['consts', 'wan-components'], function(consts) {

c.c('Player', {
  
  XSPEED: 5,
  BOUNCING: 0.2,
  FRICTION: 0.82,
  JUMP_TABLE: [9, 12.5, 16, 19],
  ROTATION_SPEED: 9,

  init: function() {
    this.addComponent(consts.RENDER + ', Image, Tween, Keyboard, Collision'); //, WiredHitBox
    //this.image(consts.ASSETS.HERO_CELL);
    this.attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE});
    
    this.bind('KeyDown', this._keyDown);
    this.bind('EnterFrame', this._enterFrame);
    this.onHit('Wall', this._hitWall);
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.jumping = false;
    this.rotating = false;
    this.collisions = {};
    this.i = this.j = 0;
    this.disabled = false;
    this.viewportXSpeed = 0;
    this.viewportYSpeed = 0;
    
    // Appearance
    this.bodySize = 1;
    this.direction = 0; // 0 = right 1 = top 2 = left 3 = bottom
    this.sprites = [];
    
    // Powerups
    this.canJump = false;
    this.attachedCells = [this]; // {index:X , cell:X} (if null, true body otherwise celltype)
    
    this.refresh(this.direction);
  },
  
  disable: function() {
    this.disabled = true;
    this.unbind('EnterFrame');
  },
  
  die: function() {
    this.disable();
  },
  
  setRotationCenter: function(center) {
    _.each(this.sprites, function(sprite, i) {
      sprite.origin((-i + 1/2 + center)*consts.TILE_SIZE, consts.TILE_SIZE / 2);
    });
  },
  
  shiftRotation: function(amount) {
    _.each(this.sprites, function(sprite) {
      sprite.rotation += amount
    }, this);
  },
  
  refresh: function(oldDirection) {
    // Prepare offset on rotation (hacky...)
    if (oldDirection !== undefined && this.bodySize > 1) {
      this._fixPositionBeforeRotation(oldDirection);
    }
    
    // Reset sprites
    _.each(this.sprites, function(sprite) {
      sprite.destroy();
    });
    this.sprites = [];
    
    // Update collision polygon & shape
    if (this.bodySize <= 1) {
      var circle = new Crafty.circle(0, 0, this.w/2);
      circle.shift(this.w/2, this.w/2);
      this.collision(circle);
    }
    else {
      this.rotation = 0;
      var newWidth = consts.TILE_SIZE * this.bodySize;
      var newHeight = consts.TILE_SIZE;
      if (this.direction % 2 == 1) {
        var buffer = newWidth;
        newWidth = newHeight;
        newHeight = buffer;
      }
      this.attr({w: newWidth, h: newHeight});
      this.collision([0,0], [newWidth,0], [newWidth,newHeight], [0,newHeight]);
    }
    
    // Create new ones
    var newSprite = null, i = 0, 
      xOffset = (this.direction == 2) ? consts.TILE_SIZE * (this.bodySize-1)  : 0,
      yOffset = (this.direction == 3) ? consts.TILE_SIZE * (this.bodySize-1) : 0;
    _.each(this.attachedCells, function(cellType) {
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
      if (cellType == this) {
        newSprite = c.e('2D, ' + consts.RENDER + ', CellHero' + spriteId)
          .attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE,
            x: xOffset + this.x + (i * consts.TILE_SIZE),
            y: yOffset + this.y});
      }
      else {
        newSprite = c.e('2D, ' + consts.RENDER + ', ' + cellType + spriteId)
          .attr({w: consts.TILE_SIZE, h: consts.TILE_SIZE,
            x: xOffset + this.x + (i * 48),
            y: yOffset + this.y});
      }
      this.attach(newSprite);
      i++;
      if (newSprite != null) {
        this.sprites.push(newSprite);
      }
      else {
        console.error("No sprite for " + cellType);
      }
    }, this);
    
    this.setRotationCenter(0);
    this.shiftRotation(90 * this.direction);
    
  },
  
  _keyDown: function(e) {
    if (e.key == Crafty.keys['ENTER'] && this.targetCell) {
        this._mergeWith(this.targetCell);
    }
    if (this.bodySize > 1) {
      var oldDirection = this.direction;
      
      if (this.isDown('DOWN_ARROW') && e.key == Crafty.keys['LEFT_ARROW']
       || this.isDown('LEFT_ARROW') && e.key == Crafty.keys['DOWN_ARROW']) {
        if (this._checkEmptyTiles((this.direction % 2 == 1) ? -this.bodySize : 0)) {
          this.direction += 3;
          this.direction %= 4;
          this.refresh(oldDirection);
        }
      }
      else if (this.isDown('DOWN_ARROW') && e.key == Crafty.keys['RIGHT_ARROW']
       || this.isDown('RIGHT_ARROW') && e.key == Crafty.keys['DOWN_ARROW']) {
         if (this._checkEmptyTiles((this.direction % 2 == 1) ? this.bodySize : -this.bodySize)) {
          this.direction++;
          this.direction %= 4;
          this.refresh(oldDirection);
        }
      }
    }
  },
  
  _checkEmptyTiles: function(until) {
    var xs;
    if (until > 0) {
      xs = _.range(this.i, this.i + until);
    }
    else {
      xs = _.range(this.i + until, this.i);
    }
    var ys = _.range(this.j - Math.abs(until) + 1, this.j + 1);

    var allEmpty = true;
    _.each(xs, function(x) {
      if (allEmpty) {
        _.each(ys, function(y) {
          if (allEmpty && this[x][y]) {
            console.log("Cannot rotate cells because of " + x + "-" + y);
            allEmpty = false;
          }
        }, this);
      }
    }, this.level);
    return allEmpty;
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
      if (this.x - this.collisions.hitFloor.obj.x > consts.TILE_SIZE * this.bodySize - 15
        && (!this.level[this.i+1] || !this.level[this.i+1][this.j+1]) && Math.abs(this.xSpeed) < 3) {
        this.xSpeed++;
      }
      if (this.x - this.collisions.hitFloor.obj.x < - (consts.TILE_SIZE * this.bodySize - 15)
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
    if (!this.isDown('DOWN_ARROW')) {
      if (this.isDown('LEFT_ARROW') && !this.collisions.hitLeftWall) {
        this.xSpeed = -this.XSPEED;
      }
      if (this.isDown('RIGHT_ARROW') && !this.collisions.hitRightWall) {
        this.xSpeed = this.XSPEED;
      }
    }
    if (this.isDown('UP_ARROW') && !this.jumping && this.canJump && this.collisions.hitFloor
        && !this.collisions.hitCeiling && !this.level[this.i][this.j-1]) {
      if (this.isDown('LEFT_ARROW')) {
        this.xSpeed = -this.XSPEED;
      }
      if (this.isDown('RIGHT_ARROW')) {
        this.xSpeed = this.XSPEED;
      }
      this.ySpeed = -this.JUMP_TABLE[this.bodySize - 1];
      this.jumping = true;
    }
    
    // Update position/rotation
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.bodySize == 1) {
      this.shiftRotation((this.x - this.prevX)*2);
    }
    
    // Update viewport
    if (c.viewport.x + this.x < consts.WIDTH/4) {
      this.viewportXSpeed += 2;
    }
    if (c.viewport.x + this.x > consts.WIDTH/2) {
      this.viewportXSpeed -= 5;
    }
    c.viewport.x += this.viewportXSpeed;
    this._clamp({
      min: {x: 0, y: 0},
      max: {x: this.level.length * consts.TILE_SIZE, y: consts.HEIGHT}
    });
    this.viewportXSpeed *= this.FRICTION * this.FRICTION;
    this.prevX = this.x;
    this.prevY = this.y;
    
    this.collisions = {};
  },
  
  _hitWall: function(e) {
    // Collisions lookup object: hitFloor, hitCeiling, hitLeftWall, hitRightWall
    if (this.disabled) {
      return;
    }
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
  },
  
  _mergeWith: function(targetCell) {
    var newCellType = targetCell.comp.replace(/^.*, /, '');
    if (newCellType == 'CellJump') {
      this.canJump = true;
      targetCell.x = this.x;
      targetCell.y = this.y;
      this.attach(targetCell);
      targetCell.attached();
    }
    else {
      this.bodySize++;
      this.attachedCells.push(targetCell.comp.replace(/^.*, /, ''));
      this.targetCell.destroy();
    }
    this.targetCell = null;
    this.refresh();
  },
  
  _fixPositionBeforeRotation: function(oldDirection) {
    //console.log(oldDirection + " " + this.direction);
    if (this.direction == 3) {
      if (oldDirection == 0) {
        this.attr({y: this.y - consts.TILE_SIZE * (this.bodySize - 1)});
      }
      else {
        this.attr({
          x: this.x + consts.TILE_SIZE * (this.bodySize - 1),
          y: this.y - consts.TILE_SIZE * (this.bodySize - 1)
        });
      }
    }
    if (this.direction == 2) {
      if (oldDirection == 3) {
        this.attr({
          x: this.x - consts.TILE_SIZE * (this.bodySize - 1),
          y: this.y + consts.TILE_SIZE * (this.bodySize - 1)
        });
      }
      else {
        this.attr({
          y: this.y + consts.TILE_SIZE * (this.bodySize - 1)
        });
      }
    }
    if (this.direction == 1) {
      if (oldDirection == 2) {
        this.attr({
          y: this.y - consts.TILE_SIZE * (this.bodySize - 1),
        });
      }
      else {
        this.attr({
          x: this.x + consts.TILE_SIZE * (this.bodySize - 1),
          y: this.y - consts.TILE_SIZE * (this.bodySize - 1),
        });
      }
    }
    if (this.direction == 0) {
      if (oldDirection == 1) {
        this.attr({
          x: this.x - consts.TILE_SIZE * (this.bodySize - 1),
          y: this.y + consts.TILE_SIZE * (this.bodySize - 1)
        });
      }
      else if (oldDirection == 3) {
        this.attr({
          y: this.y + consts.TILE_SIZE * (this.bodySize - 1)
        });
      }
    }
  },
  
  // Adapted version of the Crafty code
  _clamp: function (bound) {
      if (bound.max.x - bound.min.x > Crafty.viewport.width) {
          bound.max.x -= Crafty.viewport.width;

          if (Crafty.viewport.x < -bound.max.x) {
              Crafty.viewport.x = -bound.max.x;
          }
          else if (Crafty.viewport.x > -bound.min.x) {
              Crafty.viewport.x = -bound.min.x;
          }
      }
      else {
          Crafty.viewport.x = -1 * (bound.min.x + (bound.max.x - bound.min.x) / 2 - Crafty.viewport.width / 2);
      }
      if (bound.max.y - bound.min.y > Crafty.viewport.height) {
          bound.max.y -= Crafty.viewport.height;

          if (Crafty.viewport.y < -bound.max.y) {
              Crafty.viewport.y = -bound.max.y;
          }
          else if (Crafty.viewport.y > -bound.min.y) {
              Crafty.viewport.y = -bound.min.y;
          }
      }
      else {
          Crafty.viewport.y = -1 * (bound.min.y + (bound.max.y - bound.min.y) / 2 - Crafty.viewport.height / 2);
      }
  }

});

});