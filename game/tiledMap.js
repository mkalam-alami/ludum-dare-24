(function() {

Crafty.c('TiledMap', {

  init: function() {
    this.tilesets = [];
    this._tileSetInfo = []; /* { name, min, max, lineWidth } */
    this._tileProperties = {}; /* Stores properties by tile ID */
  },
  
  tiledMap: function(mapUrl, renderType, callback) {
    this._renderType = renderType;
    
    var tiledMap = this;
    $.getJSON(mapUrl, function(mapJson) {
      tiledMap._buildTileSets(mapJson);
      tiledMap._buildTileLayers(mapJson);
      if (callback) callback(this);
    });
    
  },
  
  _buildTileSets: function(mapJson) {
    var tileSetKey, tilePropertiesKey, tileSetJson, map;
  
    for (tileSetKey in mapJson.tilesets) {
      tileSetJson = mapJson.tilesets[tileSetKey];
      
      // Create tile set
      map = {};
      map[tileSetJson.name] = [0, 0];
      Crafty.sprite(tileSetJson.tilewidth, tileSetJson.tileheight, tileSetJson.image, map);
      
      // Store tileset info
      this._tileSetInfo.push({
        name: tileSetJson.name,
        min: tileSetJson.firstgid,
        max: tileSetJson.firstgid + (tileSetJson.imagewidth / tileSetJson.tilewidth) * (tileSetJson.imageheight / tileSetJson.tileheight),
        lineWidth: tileSetJson.imagewidth / tileSetJson.tilewidth,
      });
      
      // Store tile types properties
      for (tilePropertiesKey in tileSetJson.tileproperties) {
        this._tileProperties[parseInt(tilePropertiesKey) + tileSetJson.firstgid] = tileSetJson.tileproperties[tilePropertiesKey];
      }
    }
    
  },
  
  _buildTileLayers: function(mapJson) {
    var tileLayerKey, tileLayerJson, dataKey, data, tileSetInfoKey, tileSetInfo, spriteName, newSprite, newObject;
  
    for (tileLayerKey in mapJson.layers) {
      tileLayerJson = mapJson.layers[tileLayerKey];
      
      if (tileLayerJson.type == "tilelayer") {
        var level = []; // XXX LD24
        
        for (dataKey in tileLayerJson.data) {
          data = tileLayerJson.data[dataKey];
          if (data != 0) {
          
            for (tileSetInfoKey in this._tileSetInfo) {
              tileSetInfo = this._tileSetInfo[tileSetInfoKey];
              if (data >= tileSetInfo.min && data < tileSetInfo.max) {
                break;
              }
            }
            
            // Create sprite
            // XXX LD24 / Handle objects
            if (this._tileProperties[data] && this._tileProperties[data].object !== undefined) {
              newSprite = Crafty.e(this._tileProperties[data].components);
            }
            else {
              newSprite = Crafty.e('2D, ' + this._renderType + ', ' + tileSetInfo.name);
              newSprite.sprite(
                  ((data - tileSetInfo.min) % tileSetInfo.lineWidth),
                  Math.floor((data - tileSetInfo.min) / tileSetInfo.lineWidth)
              );
            }
            newSprite.y = newSprite.h * Math.floor(dataKey / tileLayerJson.width);
            newSprite.x = newSprite.w * (dataKey % tileLayerJson.width);
            newSprite.level = level; // XXX LD24
            if (this._tileProperties[data]) {
              // Attach properties
              newSprite.properties = this._tileProperties[data];
              
              // Attach components
              if (this._tileProperties[data].components) {
                newSprite.addComponent(this._tileProperties[data].components);
              }
            }
            
            // XXX LD24 / Fill level table
            var tileI = (dataKey % tileLayerJson.width), tileJ = Math.floor(dataKey / tileLayerJson.width);
            if (!level[tileI]) {
              level[tileI] = [];
            }
            if (newSprite.has('Wall')) {
              level[tileI][tileJ] = newSprite;
            }
          }
        }
      }
      else if (tileLayerJson.type == "objectgroup") {
        for (dataKey in tileLayerJson.objects) {
          data = tileLayerJson.objects[dataKey];
          
          // XXX LD24 / Custom objects
          if (data.properties.components == 'IngameMessage') {
            Crafty.e('IngameMessage')
              .attr({x: data.x, y: data.y, w: data.width, h: data.height})
              .ingameMessage(data.properties.text, data.properties.image, data.properties.delayms);
          }
          else if (data.properties.components == 'Image') {
            Crafty.e('IngameImage')
              .attr({x: data.x, y: data.y})
              .ingameImage(data.properties.image);
          }
        
         /* newObject = Crafty.e('2D').attr({
            x: data.x,
            y: data.y,
            w: data.width,
            h: data.height
          });
          if (data.properties) {
            // Attach properties
            newObject.properties = data.properties;
            
            // Attach components
            if (data.properties.components) {
              newObject.addComponent(data.properties.components);
            }
          }
          */
        }
      }
    }
  }

});

})();
