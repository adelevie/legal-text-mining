var fs = require('fs');
var _ = require('underscore');
var xml2js = require('xml2js');
require('citation');

var court = 'ca1';
var all_ciations = []
var parser = new xml2js.Parser();
var filename = 'data/' + court + '.xml';

fs.readFile(filename, function(err, data) {
  parser.parseString(data, function(err, result) {
    
    var opinions = result['opinions']['opinion'];
    
    _.each(opinions, function(opinion) {
      var citations = Citation.find(opinion['_'], {excerpt:100})['citations'];
      all_ciations.push({
        case_name: opinion['$']['case_name'],
        id: opinion['$']['id'],
        citations: citations
      });
    });

  });
  var output = JSON.stringify(all_ciations);
  fs.writeFile('output/' + court + '.json', output, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('The file was saved!');
    }
  });

});
