define({
  
  run: function() {

    // Force focus
    document.getElementById('cr-stage').focus();

    // Game scene
    c.scene('game', function() {
      for (var i = 0; i < 10; i++) {
        var shade = i * 25;
        c.e('2D, DOM')
          .setName('Square ' + i)
          .attr({x: i*40 + 10, y: 10, w: 30, h: 30})
          .css({'background-color': 'rgb(' + shade + ',' + shade + ',' + shade + ')'});
      }
    });
      
    // Init Crafty
    c.init(800, 600);
    c.modules({ 'crafty-debug-bar': 'release' }, function () {
      Crafty.debugBar.show();
      c.scene('game');
    });

  }

});
