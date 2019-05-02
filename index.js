(function (root, factory){
  if(typeof define === 'function' && define.amd){
    define([], function(){
      return (root.alignmentViewer = factory());
    });
  } else if(typeof module === 'object' && module.exports){
    module.exports = factory();
  } else {
    root.alignmentViewer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function(){
	var alignmentViewer = function(seqs, config){
    config = Object.assign({
      width: 1,
      height: 1,
      colors: {
  			'A' : '#ccff00',
        'C' : '#ffff00',
  			'G' : '#ff9900',
  			'T' : '#ff6600',
        'ambig': '#ffffff'
      },
      showChar: false,
      showID: true,
      useWorker: true
    }, config);
		var longest = 0;
    var offset = 0;
    var n = seqs.length;
    for(var i = 0; i < n; i++){
      var s = seqs[i];
      if(s.seq.length > longest) longest = s.seq.length;
      if(s.id.length > offset) offset = s.id.length;
    }
    config.height |= 0;
    config.width |= 0;
    offset *= config.height/2;
    var xSpacer = config.width/2, ySpacer = config.height/2;
    var canvas = document.createElement('canvas');
    canvas.width = longest * config.width + offset;
    canvas.height = seqs.length * config.height;
    var context = canvas.getContext('2d', { alpha: false });
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = (config.height-2) + 'px mono';
    for(var row = 0; row < n; row++){
      var s = seqs[row].seq.toUpperCase();
      var m = s.length;
      var y = row*config.height;
      if(config.showID){
        context.textAlign = 'right';
        context.textBaseline = 'middle';
        context.fillStyle = 'black';
        context.fillText(seqs[row].id, offset, y+ySpacer, offset);
      }
      for(var col = 0; col < m; col++){
        var c = s[col], x = col*config.width+offset;
				context.fillStyle = (c in config.colors) ? config.colors[c] : config.colors['ambig'];
        context.fillRect(x, y, config.width, config.height);
        if(config.showChar){
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillStyle = 'black';
          context.fillText(c, x+xSpacer, y+ySpacer, config.width);
        }
      }
    }
    return new Promise(function(resolve){ resolve(canvas); });
	};
  return alignmentViewer;
}));