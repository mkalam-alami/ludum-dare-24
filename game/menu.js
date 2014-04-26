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
      this.tween({alpha: .3}, 1500);
      this.tween(to, 8000);
    },
    _tweenEnd: function(param) {
      if (param && param.alpha) {
        if (this.alpha > .2) {
          this.tween(this._to, 500);
        }
        else {
          this.destroy();
        }
      }
      else if (param && param.x) {
          this.tween({alpha: 0.0}, 500);
      }
    }
  });
  c.c('WallOfText', {
    init: function() {
      this.addComponent('2D, DOM');
      this.bind('EnterFrame', this._enterFrame);
      this._next = 0;
    },
    _enterFrame: function() {
      if (this._next <= 0) {
        this._next = Utils.random(160)+50;
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
      this.textFont({ family: "'TVEFont', serif", size: '25pt' });
      this.textColor('#332222', 0.9);
      this.attr({w: 400, h: 50});
    },
    menuEntry: function(label) {
      this.text(label);
      return this;
    }
  });
  c.c('Menu', {
    init: function() {
      this.YSIZE = 260;
      this.BASEY = 260;
      this.BASEX = 200;
      
      this.addComponent('2D, ' + consts.RENDER + ', Image, Tween, Keyboard');
      this.image(consts.ASSETS.UPDOWN);
      this.bind('KeyDown', this._keyDown);
      this.bind('EnterFrame', this._enterFrame);
      this.bind('TweenEnd', this._tweenEnd);
      this._callbacks = [];
      this._entries = [];
      this._currentIndex = 0;
      this._menuSize = 1;
      this._index = 0;
      this._moving = false;
    },
    menu: function(size) {
      this._menuSize = size;
      this._update(true);
      return this;
    },
    addEntry: function(text, callback, postCompo) {
    
     // 2 columns menu
     var offsetx = offsety = 0;
     if (this._menuSize >= 6 && this._entries.length >= this._menuSize/2) {
        offsetx = 300;
        offsety = -this.YSIZE/2;
     }
    
     var entry = c.e('MenuEntry')
      .menuEntry(text)
      .attr({
        x: this.BASEX + 50 + offsetx,
        y: this.BASEY + this.YSIZE * this._entries.length / this._menuSize + offsety
      });
      if (postCompo) {
        entry.textColor('#DD4422', 1.0);
      }
      this._entries.push(entry);
      this._callbacks.push(callback);
      this._index++;
      return entry;
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
    },
    _enterFrame: function() {
      if (!this._moving) {
        var updateNeeded = false;
        var isUpPressed = Utils.isUpPressed();
        var isDownPressed = Utils.isDownPressed();
        if (isUpPressed && !this._wasUpPressed) {
          this._currentIndex += this._menuSize - 1;
          updateNeeded = true;
          if (!soundManager.muted) {
            soundManager.play(consts.SOUNDS.CHANGE.ID);
          }
        }
        if (isDownPressed && !this._wasDownPressed) {
          this._currentIndex++;
          updateNeeded = true;
          if (!soundManager.muted) {
            soundManager.play(consts.SOUNDS.CHANGE.ID);
          }
        }
        this._wasUpPressed = isUpPressed;
        this._wasDownPressed = isDownPressed;
        
        if (updateNeeded) {
          this._currentIndex %= this._menuSize;
          this._update();
        }
      }
    },
    _update: function(fast) {
      this._moving = true;
      this.tween({
          x: this.BASEX + ((this._currentIndex >= this._menuSize/2 && this._menuSize >= 6) ? 300 : 0),
          y: this.BASEY + this.YSIZE * this._currentIndex / this._menuSize - ((this._currentIndex >= this._menuSize/2 && this._menuSize >= 6) ? this.YSIZE/2 : 0)
      }, (fast) ? 1 : 6);
    },
    _tweenEnd: function() { 
      this._moving = false;
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
    var sceneChange = false;
    menu = c.e('Menu').menu((gameState.gameFinished) ? 4 : 3);
    menu.addEntry('Start a new game', function() {
      if (!sceneChange) {
        sceneChange = true;
        gameState.currentLevel = 1;
        soundManager.stopAll();
        soundManager.play(consts.SOUNDS.START.ID);
        c.e('SceneFade').sceneFade('startLevel');
      }
    });
    menu.addEntry('Choose level', function() {
      c.scene('chooseLevel');
    });
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
    if (gameState.gameFinished) {
      menu.addEntry('1000 kittens', function() {
        if (!sceneChange) {
          sceneChange = true;
          gameState.currentLevel = "kittens";
          soundManager.stopAll();
          soundManager.play(consts.SOUNDS.START.ID);
          c.e('SceneFade').sceneFade('startLevel');
        }
      }, true);
    }
    
    // Fade in menu contents
    _.each(c('Tween'), function(id) {
      var e = c(id);
      e.attr({alpha: 0});
      e.tween({alpha: 1}, 2000);
    });
    logo.tween({alpha: 1}, 1000);
  });
  
  c.scene('chooseLevel', function() {
    c.e('WallOfText');
  
    c.e('MenuEntry')
      .text("In red: post-compo levels")
      .textColor('#DD4422', 1.0)
      .attr({
        x: 430,
        y: 480
      });
      
    menu = c.e('Menu'),
    menu.YSIZE = 650;
    menu.BASEY = 100;
    menu.BASEX = 30;
    menu.menu(consts.LEVEL_COUNT + 3);
    
    levelNames = {
      7: 'Diary entry 2'
    };
    
    var sceneChange = false;
    menu.addEntry('Diary entry 1', function() {
      if (!sceneChange) {
        sceneChange = true;
        soundManager.stopAll();
        soundManager.play(consts.SOUNDS.START.ID);
        c.e('SceneFade').sceneFade('intro');
      }
    });
    for (var i = 1; i <= consts.LEVEL_COUNT; i++) {
      var entry = menu.addEntry((levelNames[i]) ? levelNames[i] : 'Level ' + ((i > 6) ? i-1 : i),
      function(entry) {
        if (!sceneChange) {
          sceneChange = true;
          gameState.currentLevel = entry.level;
          soundManager.stopAll();
          soundManager.play(consts.SOUNDS.START.ID);
          c.e('SceneFade').sceneFade('startLevel');
        }
      }, i > 9);
      entry.level = i;
    }
    menu.addEntry('Final diary entry', function() {
      if (!sceneChange) {
        sceneChange = true;
        soundManager.stopAll();
        soundManager.play(consts.SOUNDS.START.ID);
        c.e('SceneFade').sceneFade('endgame');
      }
    });
    menu.addEntry('Exit', function() {
      c.scene('menu');
    });
    
    c.e('2D, DOM, Keyboard').bind('KeyDown', function(e) {
      if (e.key == c.keys['ESC']) {
        c.scene('menu');
      }
    });
  });
  
});
