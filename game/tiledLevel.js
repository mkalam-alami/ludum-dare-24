// Adapted version of the importer at: https://github.com/mleveck/Crafty-Tiled-Map-Importer

(function() {

  Crafty.c("TiledLevel", {
  
    // Create tileset
    makeTiles: function(ts, drawType) {
      var components, i, posx, posy, sMap, sName, tHeight, tName, tNum, tWidth, tsHeight, tsImage, tsProperties, tsWidth, xCount, yCount, _ref;
      tsImage = ts.image, tNum = ts.firstgid, tsWidth = ts.imagewidth, tNumOffset = ts.firstgid - 1;
      tsHeight = ts.imageheight, tWidth = ts.tilewidth, tHeight = ts.tileheight;
      tsProperties = ts.tileproperties;
      xCount = tsWidth / tWidth | 0;
      yCount = tsHeight / tHeight | 0;
      sMap = {};
      for (i = 0, _ref = yCount * xCount; i < _ref; i += 1) {
        posx = i % xCount;
        posy = i / xCount | 0;
        sName = "tileSprite" + tNum;
        tName = "tile" + tNum;
        sMap[sName] = [posx, posy];
        components = "2D, " + drawType + ", " + sName + ", MapTile";
        if (tsProperties) {
          if (tsProperties[tNum - 1 - tNumOffset]) {
            var tsPropIndex = tNum - 1 - tNumOffset;
            if (tsProperties[tsPropIndex]["components"]) {
              if (tsProperties[tsPropIndex]["object"] !== undefined) {
                components = "2D, " + drawType + ", " + tsProperties[tsPropIndex]["components"];
              }
              else {
                components += ", " + tsProperties[tsPropIndex]["components"];
              }
            }
          }
        }
        Crafty.c(tName, {
          comp: components,
          init: function() {
            this.addComponent(this.comp);
            return this;
          }
        });
        tNum++;
      }
      Crafty.sprite(tWidth, tHeight, tsImage, sMap);
      return null;
    },
    
    // Create tiled layer
    makeLayer: function(layer) {
      var i, lData, lHeight, lWidth, tDatum, tile, _len;
      lData = layer.data, lWidth = layer.width, lHeight = layer.height;
      var level = [];
      var side = Math.max(lWidth, lHeight);
      for (i = 0, _len = lData.length; i < _len; i++) {
        tDatum = lData[i];
        var tileI = i % side;
        var tileJ = Math.floor(i / side);
        if (tDatum) {
          tile = Crafty.e("tile" + tDatum);
          tile.x = (i % lWidth) * tile.w;
          tile.y = (i / lWidth | 0) * tile.h;
          tile.i = tileI;
          tile.j = tileJ;
          tile.level = level;
          if (tile.setup) {
            tile.setup();
          }
          
          // Fill level table
          if (!level[tileI]) {
            level[tileI] = [];
          }
          if (tile.has('Wall')) {
            level[tileI][tileJ] = tile;
          }
        }
        
        
      }
      return null;
    },
    
    // Create object layer
    makeObjects: function(layer) {
      _.each(layer.objects, function(object) {
        if (object.properties.components == 'IngameMessage') {
          Crafty.e('IngameMessage')
            .attr({x: object.x, y: object.y, w: object.width, h: object.height})
            .ingameMessage(object.properties.text, object.properties.image, object.properties.delayms);
        }
        else if (object.properties.components == 'Image') {
          Crafty.e('IngameImage')
            .attr({x: object.x, y: object.y})
            .ingameImage(object.properties.image);
        }
      });
    },
    
    tiledLevel: function(levelURL, drawType, callback) {
      var _this = this;
      $.ajax({
        type: 'GET',
        url: 'levels/' + levelURL,
        dataType: 'json',
        data: {},
        async: false,
        success: function(level) {
          var lLayers, ts, tsImages, tss;
          lLayers = level.layers, tss = level.tilesets;
          drawType = drawType != null ? drawType : "Canvas";
          tsImages = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tss.length; _i < _len; _i++) {
              ts = tss[_i];
              _results.push(ts.image);
            }
            return _results;
          })();
         // Crafty.load(tsImages, function() {
            var layer, ts, _i, _j, _len, _len2;
            for (_i = 0, _len = tss.length; _i < _len; _i++) {
              ts = tss[_i];
              _this.makeTiles(ts, drawType);
            }
            for (_j = 0, _len2 = lLayers.length; _j < _len2; _j++) {
              layer = lLayers[_j];
              if (layer.type == "objectgroup") {
                _this.makeObjects(layer);
              }
              else {
                _this.makeLayer(layer);
              }
            }
            if (callback) {
              callback();
            }
            return null;
        // });
          return null;
        }
      });
      return this;
    },
    init: function() {
      return this;
    }
  });

}).call(this);
