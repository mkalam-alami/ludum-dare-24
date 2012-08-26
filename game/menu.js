define(['consts', 'wan-components'], function(consts) {
  
  c.c('MenuEntry', {
    init: function() {
      this.addComponent('2D, ' + consts.RENDER + ', Text, Tween');
      this.attr({w: 200, h: 50});
      this.textFont({ family: "'Niconne', sans-serif", size: '30pt' });
      this.textColor('#332222', 0.9);
    }
  });
  c.c('Menu', {
    YSIZE: 230,
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
        y: this.BASEY + this.YSIZE * (this._entries.length - 1) / this._menuSize + 40
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
    
    var logo = c.e('2D, ' + consts.RENDER + ', Image, Bouncey, Tween')
      .attr({x: 100, y: 100})
      .image(consts.ASSETS.LOGO)
      .bouncey();
    
    menu = c.e('Menu').menu((gameState.gameFinished) ? 5 : 4);
    menu.addEntry('Start a new game', function() {
      gameState.currentLevel = consts.START_LEVEL;
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