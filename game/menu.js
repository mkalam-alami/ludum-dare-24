define(['consts', 'wan-components'], function(consts) {
  
  c.c('WallOfTextText', {
    init: function() {
      this.addComponent('2D, ' + consts.RENDER + ', Image, Tween');
      this.bind('TweenEnd', this._tweenEnd);
      this.alpha = 0;
    },
    wallOfTextText: function(id, from, to) {
      this.image(consts.ASSETS['TEXT' + id]);
      this.attr(from);
      this.tween({alpha: .3}, 50);
      this.tween(to, 300);
    },
    _tweenEnd: function(param) {
      if (param == 'alpha') {
        if (this.alpha > .2) {
          this.tween(this._to, 500);
        }
        else {
          this.destroy();
        }
      }
      else if (param == 'x') {
          this.tween({alpha: 0}, 30);
      }
    }
  });
  c.c('WallOfText', {
    init: function() {
      this.bind('EnterFrame', this._enterFrame);
      this._next = 0;
    },
    _enterFrame: function() {
      if (this._next <= 0) {
        this._next = Utils.random(200)+50;
        var from = {x: Utils.random(900)-100, y: Utils.random(700)-100};
        var to = {x: from.x, y: from.y};
        if (Utils.random(2) == 0) {
          to.x = Utils.random(900)-100;
        }
        else {
          to.y = Utils.random(700)-100;
        }
        var to = {x: Utils.random(700), y: Utils.random(500)};
        c.e('WallOfTextText')
          .wallOfTextText(Utils.random(3)+1, from, to);
      }
      this._next--;
    
    }
  });
  
  
  c.c('MenuEntry', {
    init: function() {
      this.addComponent('2D, ' + consts.RENDER + ', Text, Tween');
      this.attr({w: 200, h: 50});
      this.textFont({ family: "'TVEFont', serif", size: '25pt' });
      this.textColor('#332222', 0.9);
    }
  });
  c.c('Menu', {
    YSIZE: 260,
    BASEY: 260,
    BASEX: 200,
    init: function() {
      this.addComponent('2D, ' + consts.RENDER + ', Image, Tween, Keyboard');
      this.image(consts.ASSETS.UPDOWN);
      this.bind('KeyDown', this._keyDown);
      this._callbacks = [];
      this._entries = [];
      this._currentIndex = 0;
      this._menuSize = 1;
      this._index = 0;
    },
    menu: function(size) {
      this._menuSize = size;
      this._update(true);
      return this;
    },
    addEntry: function(text, callback, disabled) {
     var entry = c.e('MenuEntry')
      .text(text)
      .attr({
        x: this.BASEX + 50,
        y: this.BASEY + this.YSIZE * this._entries.length / this._menuSize - 15
      });
      if (disabled) {
        entry.textColor('#332222', 0.2);
      }
      this._entries.push(entry);
      this._callbacks.push((disabled) ? null : callback);
      this._index++;
      return this;
    },
    setCallback: function(index, callback) {
      this._callbacks[index] = callback;
      return this;
    },
    _keyDown: function(e) {
      if (e.key == c.keys['ENTER']) {
        var callback = this._callbacks[this._currentIndex];
        if (callback) {
          callback(this._entries[this._currentIndex]);
        }
      }
      if (Utils.isUpPressed(e)) {
        this._currentIndex += this._menuSize - 1;
        if (!soundManager.muted) {
          soundManager.play(consts.SOUNDS.CHANGE.ID);
        }
      }
      if (Utils.isDownPressed(e)) {
        this._currentIndex++;
        if (!soundManager.muted) {
          soundManager.play(consts.SOUNDS.CHANGE.ID);
        }
      }
      this._currentIndex %= this._menuSize;
      this._update();
    },
    _update: function(fast) {
      this.tween({
          x: this.BASEX,
          y: this.BASEY + this.YSIZE * this._currentIndex / this._menuSize
      }, (fast) ? 1 : 5);
    }
  });
  
  c.scene('menu', function() {
    c.viewport.x = c.viewport.y = 0;
    soundManager.stopAll();
    soundManager.play(consts.SOUNDS.MUSIC_MAINSCREEN.ID);
    
    c.e('WallOfText');
    
    var logo = c.e('2D, ' + consts.RENDER + ', Image, Bouncey, Tween')
      .attr({x: 20, y: 30})
      .image(consts.ASSETS.LOGO)
      .bouncey();
    
    menu = c.e('Menu').menu((gameState.gameFinished) ? 5 : 4);
    menu.addEntry('Start a new game', function() {
      gameState.currentLevel = 1;
      soundManager.stopAll();
      soundManager.play(consts.SOUNDS.START.ID);
      c.e('SceneFade').sceneFade('startLevel');
    })
    menu.addEntry('Continue game', function() {
      soundManager.stopAll();
      soundManager.play(consts.SOUNDS.START.ID);
      c.e('SceneFade').sceneFade('startLevel');
    }, gameState.currentLevel <= 1);
    menu.addEntry('Play introduction', function() {
      soundManager.stopAll();
      soundManager.play(consts.SOUNDS.START.ID);
      c.e('SceneFade').sceneFade('intro');
    });
    if (gameState.gameFinished) {
      menu.addEntry('1000 kittens', function() {
        gameState.currentLevel = "kittens";
        soundManager.stopAll();
        soundManager.play(consts.SOUNDS.START.ID);
        c.e('SceneFade').sceneFade('startLevel');
      });
    }
    menu.addEntry('Sound: ' + ((gameState.mute) ? 'disabled' : 'enabled'), function(entry) {
      var base = 'Sound: ';
      if (gameState.mute) {
        gameState.mute = false;
        soundManager.unmute();
        entry.text(base + 'enabled');
      }
      else {
        gameState.mute = true;
        soundManager.mute();
        entry.text(base + 'disabled');
      }
      $.jStorage.set('gameState', gameState);
    });
    
    // Fade in menu contents
    _.each(c('Tween'), function(id) {
      var e = c(id);
      e.attr({alpha: 0});
      e.tween({alpha: 1}, 80);
    });
    logo.tween({alpha: 1}, 20);
  });
  
});