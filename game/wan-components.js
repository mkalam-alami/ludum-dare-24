// Utility
// -------

var c = Crafty;
var Utils = {
  // Returns a random number between `0` and `i`.
  random: function(i) {
    return Math.floor(Math.random()*i);
  },
  // Returns randomly `true` or `false`.
  randomBoolean: function() {
    return (Math.random() > 0.5);
  },
  // Returns a random element from the given array.
  randomElement: function(array) {
    return array[Utils.random(array.length)];
  },
  isDownPressed: function(e) {
    if (e)
      return e.key == c.keys['DOWN_ARROW'] || e.key == c.keys['S'];
    else
      return c.keydown[c.keys['DOWN_ARROW']] || c.keydown[c.keys['S']];
  },
  isUpPressed: function(e) {
    if (e)
      return e.key == Crafty.keys['UP_ARROW'] || e.key == Crafty.keys['Z'] || e.key == Crafty.keys['W'];
    else
      return c.keydown[c.keys['UP_ARROW']] || c.keydown[c.keys['Z']] || c.keydown[c.keys['W']];
  },
  isLeftPressed: function(e) {
    if (e)
      return e.key == Crafty.keys['LEFT_ARROW'] || e.key == Crafty.keys['Q'] || e.key == Crafty.keys['A'];
    else
      return c.keydown[c.keys['LEFT_ARROW']] || c.keydown[c.keys['Q']] || c.keydown[c.keys['A']];
  },
  isRightPressed: function(e) {
    if (e)
      return e.key == Crafty.keys['RIGHT_ARROW'] || e.key == Crafty.keys['D'];
    else
      return c.keydown[c.keys['RIGHT_ARROW']] || c.keydown[c.keys['D']];
  }
};

// Graphical toys
// --------------

// Makes an entity bounce vertically
c.c('Bouncey', {
  init: function() {
    this.requires('2D');
    this.bind('EnterFrame', this._enterFrame);
  },
  bouncey: function(amplitude, frequency, offset) {
    this.amplitude = (amplitude !== undefined) ? amplitude : 5;
    this.frequency = (frequency !== undefined) ? frequency : 1;
    this.offset = (offset !== undefined) ? offset : 0;
    this.baseY = this.y;
    this.bouncingPaused = false;
    return this;
  },
  pauseBouncing: function(pause) {
    this.bouncingPaused = (typeof pause == 'boolean') ? pause : !this.bouncingPaused;
  },
  _enterFrame: function(e) {
    if (this.baseY && !this.bouncingPaused) {
      this.attr({
        y: this.baseY + this.amplitude*Math.cos(this.offset + e.frame*this.frequency/30)
      });
    }
  }
});


// Scripts
// -------

// Allows to schedule calls to any object (time unit = frames)
c.c('Script', {
  init: function() {
    this.addComponent('Keyboard');
    this.t = 0;
    this.actions = [];
    this.bind('EnterFrame', this._enterFrame);
    this.pause = true;
    this.loop = true;
    this.currentActionIndex = 0;
    this.currentAction = null;
    this.skipDelay = 0;
  },
  
  action: function(delay, context, callback /* [args] */) {
    var args = [];
    if (arguments.length > 3) {
      for (var i = 3; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }
    this.actions.push({
      delay: delay,
      context: context,
      callback: (typeof(callback) == 'String') ? context[callback] : callback,
      arguments: args
    });
    return this;
  },
  
  run: function(loop) {
    this.pause = false;
    this.loop = (loop !== undefined) ? loop : false;
    return this;
  },
  
  togglePause: function() {
    this.pause = !this.pause;
    return this;
  },
  
  _enterFrame: function() {
    if (!this.pause) {
      if (this.currentActionIndex >= this.actions.length) {
        if (this.loop) {
          this.currentActionIndex = 0;
        }
        else {
          this.pause = true;
          return;
        }
      }
      if (this.currentAction == null) {
        this.currentAction = this.actions[this.currentActionIndex];
      }
      // Skip script
      if (this.isDown('ESC')) {
        this.currentActionIndex = this.actions.length - 1;
        this.currentAction = this.actions[this.currentActionIndex];
        this.t = this.currentAction.delay;
      }
      
      this.t++;
      if (this.skipDelay > 0) {
        this.skipDelay--;
      }
      if (this.currentAction.delay <= this.t || (this.isDown('ENTER') && this.skipDelay == 0)) {
        // Skip action
        if (this.isDown('ENTER')) {
          this.skipDelay = 10;
        }
        this.currentAction.callback.apply(this.currentAction.context, this.currentAction.arguments);
        this.currentAction = null;
        this.currentActionIndex++;
        this.t = 0;
      }
    }
  }
});


// Trajectories
// ------------

c.c('Trajectory', {
  init: function() {
    this.requires('2D');
    this.bind('EnterFrame', this._enterFrame);
  },
  trajectory: function() {
    switch (arguments[0]) {
      case 'points':
        // TODO Replace interpolation with speed?
        this.trajectory = new PointsTrajectory(arguments[1], arguments[2]); break;
    }
    return this;
  },
  _enterFrame: function() {
    if (this.trajectory) {
      this.attr(this.trajectory.next());
    }
  }
});

var AbstractArrayBasedTrajectory = Class.extend({
  init: function(points, interpolation) {
    this.steps = points || [[0, 0]];
    this.currentStepIndex = 0;
    this.currentStep = this.steps[0];
    this.currentInterpolationFrame = 0;
    this.interpolation = interpolation || c.timer.getFPS();
  },
  next: function() {
    var nextStepIndex = (this.currentStepIndex + 1) % this.steps.length;
    
    // Switch to next step
    if (this.currentInterpolationFrame >= this.interpolation) {
      this.currentStepIndex = nextStepIndex;
      this.currentStep = this.steps[nextStepIndex];
      this.currentInterpolationFrame = 0;
    }
    
    var ratio = this.currentInterpolationFrame++ / this.interpolation;
    if (ratio == 0) {
      // Exact step
      return this.currentStep;
    }
    else {
      // Interpolated step
      return {
        x: this.currentStep.x*(1-ratio) + this.steps[nextStepIndex].x*ratio,
        y: this.currentStep.y*(1-ratio) + this.steps[nextStepIndex].y*ratio
      };
    }
  }
});

var PointsTrajectory = AbstractArrayBasedTrajectory.extend({
  init: function(points, interpolation) {
    this._super(points, interpolation);
  }
});
