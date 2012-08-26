define(['consts', 'wan-components'], function(consts) {

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
      .attr({x: x, y: y, w: w || 1000, h: 100})
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
  

  // Endgame
  c.scene('endgame', function() {
    c.e('2D, DOM, Text, GameOver')
      .attr({x: 0, y: $stage.height()/2 - 50, w: $stage.width() - 80, h: 40})
      .text('Congratulations, you finished the game.<br />It was awesome, right?');
    c.e('2D, DOM, Text, MessageCentered')
      .attr({x: 0, y: $stage.height() - 50, w: $stage.width(), h: 40})
      .text('<a href=".">Restart?</a>');
  });
  
  // Intro
  c.scene('intro', function() {
  
    // TODO
    c.e('Script')
      .action(0, this, write, 100, 100, 'Salut les gens', 3)
      .action(50, this, image, 400, 200, consts.ASSETS.ILLUS1)
      .action(100, this, write, 150, 150, 'Mon nom est bob', 2)
      .action(100, this, write, 150, 200, 'Je n\'ai pas d\'amis', 2)
      .action(100, this, write, 150, 250, '(intro de test)', 1)
      .action(50, this, fadeout)
      .action(100, c, c.scene, 'nextLevel')
      .run();
  });


});