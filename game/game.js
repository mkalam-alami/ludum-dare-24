define(['consts', 'wan-components', 'tiledLevel', 'player'], function(consts) {
  
  return function() {

    // Force focus
    var stage = document.getElementById('cr-stage');
    if (stage.focus) {
      stage.focus();
    }

    // Game scene
    c.scene('game', function() {
      c.e('TiledLevel').tiledLevel('level1.json', 'DOM', function() {
        console.log('level1.json loaded');
      });
      c.e('2D, DOM, Text').bind('EnterFrame', function() {
        this.text(c.timer.getFPS());
      });
    });
    
    c.scene('game');
      
  }

});
