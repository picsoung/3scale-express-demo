var _und = require('../underscore-min');
fs = require('fs');

var wordmap ={}

function Analyser(){
	var lazy = require("lazy");
  var fs = require("fs");

  new lazy(fs.createReadStream('./data/working_AFINN-111.txt'))
    .lines
    .forEach(function(line){
        var arrLine = line.toString().split("\t");
        var word = arrLine[0];
        var value = arrLine[1]
        wordmap[word.trim()] = parseInt(value.trim());
    }
  );
}

Analyser.prototype.word = function(req,res){
	var vw = sanitize(req);
  return { word: req, sentiment: (wordmap[vw] != undefined) ? wordmap[vw] : "unknown"}  ;
};

Analyser.prototype.sentence = function(req,res){
  var vw = sanitize(req);
  var total =0;
  var count = 0;
  _und.each(vw,function(num,i){
    if(_und.isNumber(wordmap[num])){
      total+=wordmap[num];
      count++;
    }
  });
  return { sentence: req, count: vw.length, sentiment: count>0 ? total/count : 0, certainty: count/vw.length}  ;
};

var sanitize = function(string){
	var result = []
  string = string.replace(/[^a-zA-Z0-9]/g, ' ')
  _und.each(string.split(' '),function(num){return result.push(num.toLowerCase().trim());})
  return result
};

module.exports = Analyser;