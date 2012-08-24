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
    this.t = 0;
    this.actions = [];
    this.bind('EnterFrame', this._enterFrame);
    this.pause = true;
    this.loop = true;
    this.currentActionIndex = 0;
    this.currentAction = null;
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
      callback: context[callback],
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
      this.t++;
      if (this.currentAction.delay <= this.t) {
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
