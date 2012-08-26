define(['consts', 'wan-components'], function(consts) {
  
  c.c('WallOfText', {
    // TODO Cool bg
  });
  
  // Scripting tools 
  
  c.c('AnimatedText', {
    init: function() {
      this.addComponent('Text');
      this.textFont({ family: "'Niconne', cursive", size: '25pt' });
      this.textColor('#663322', 0.9);
    },
    animatedText: function(text, delay) {
      this.enforcedw = this.w;
      this.enforcedh = this.h;
      this._delay = delay || 1;
      this._textBuffer = text;
      this._timer = this._delay;
      this.bind('EnterFrame', this._enterFrame);
      this._enterFrame();
      return this;
    },
    _enterFrame: function() {
      var letter = this._textBuffer[0];
      if (letter !== undefined) {
        this._timer++;
        if (this._timer >= this._delay) {
          this._textBuffer = this._textBuffer.slice(1);
          this.text(this._text + letter);
          this._timer = 0;
          this.attr({w: this.enforcedw, h: this.enforcedh});
        }
      }
    }
  });
  
  var write = function(x, y, text, speed, w) {
    c.e('2D, ' + consts.RENDER + ', AnimatedText, Tween')
      .attr({x: x, y: y - 100, w: w || 1000, h: 200})
      .animatedText(text, speed || 3);
  }
  
  var image = function(x, y, url) {
    c.e('2D, ' + consts.RENDER + ', Image, Tween')
      .attr({x: x, y: y, alpha: 0})
      .image(url)
      .tween({alpha: 1}, 50);
  }
  
  var fadeout = function() {
    _.each(c('Tween'), function(id) {
      c(id).tween({alpha: 0}, 50);
    });
  }
  
  // Intro script
  
  c.scene('intro', function() {
    soundManager.stopAll();
    music = soundManager.getSoundById(consts.SOUNDS.MUSIC_CUTSCENES.ID);
    if (music.playState == 0) {
      music.play();
    }
    
    if (consts.mute) {
      soundManager.mute();
    }
    
    c.e('Script')
      .action(0, this, write, 50, 50, 'The discoveries I just made are fascinating.', 2)
      .action(130, this, write, 50, 90, 'They will change our conception of biology, medicine...', 2)
      .action(50, this, image, 450, 210, consts.ASSETS.ILLUS1)
      .action(0, this, image, 570, 20, consts.ASSETS.GUISKIP)
      .action(70, this, write, 50, 130, 'And, well... life.', 4)
      .action(120, this, write, 50, 200, 'But it\'s to soo soon to share this.', 1)
      .action(70, this, write, 50, 240, 'Too dangerous...', 2)
      .action(0, this, image, 100, 500, consts.ASSETS.TEXT1)
      .action(60, this, write, 50, 280, 'I would probably meet the same', 2)
      .action(60, this, write, 50, 320, 'fate as that Galilei genius.', 2)
      .action(100, this, fadeout)
      .action(30, this, write, 50, 100, 'I\'m leaving these notes here.', 2)
      .action(80, this, write, 50, 150, 'Hopefully they will be found when the world is ready.', 1)
      .action(150, this, write, 50, 250, 'May 2, 1642', 1)
      .action(30, this, write, 50, 300, 'A. K.', 1)
      .action(120, this, fadeout)
      .action(70, c, c.scene, 'menu')
      .run();
  });

  // Endgame
  
  c.scene('endgame', function() {
    c.e('2D, DOM, Text, GameOver')
      .attr({x: 0, y: consts.HEIGHT/2 - 50, w: consts.WIDTH - 80, h: 40})
      .text('Congratulations, you finished the game.<br />It was awesome, right?'); //  TODO
    c.e('2D, DOM, Image, Keyboard')
      .attr({x: consts.WIDTH/2 - 85, y: consts.HEIGHT - 50})
      .image(consts.ASSETS.ESCAPE)
      .bind('KeyDown', function(e) {
        if (e.key == c.keys['ESC']) {
          c.scene('menu');
        }
      });
  });

});