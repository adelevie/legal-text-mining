var _ = require('underscore');

var court = 'ca1';
var casesWithCitations = require('./output/' + court + '.json');

var citationsWithCase = function(casesWithCitations) {
  var unflattened = _.map(casesWithCitations, function(caseWithCitations) {
    return _.map(caseWithCitations['citations'], function(citation) {
      citation['case_name'] = caseWithCitations['case_name'];
      citation['case_id']   = caseWithCitations['id'];
      return citation;
    });
  });

  return _.flatten(unflattened);
};

var citationsToUsCode = function(citations) {
  return _.where(citations, {type: 'usc'});
};

var usCodeSectionsFromCitationsWithCase = function(citations) {
  var sections =  _.map(citationsToUsCode(citations), function(citation) {
    return citation['usc']['title'];
  });

  return _.uniq(sections);
};

var reportsFromCitationsWithCase = function(myCitationsWithCase) {
  var sections = usCodeSectionsFromCitationsWithCase(myCitationsWithCase);
  return _.map(sections, function(section) {
    var cases = _.filter(citationsToUsCode(myCitationsWithCase), function(citation) {
      return citation['usc']['title'] === section;
    });
    var myCases = _.map(cases, function(myCase) {
      return {
        case_name: myCase['case_name'],
        case_id: myCase['case_id'],
        full_cite: myCase['usc']['id'],
        index: myCase['index'],
        excerpt: myCase['excerpt']
      };
    });

    return {
      title: section,
      cases: myCases
    };
  });
};

var myCitationsWithCase = citationsWithCase(casesWithCitations);
var myReports = reportsFromCitationsWithCase(myCitationsWithCase);

var relevantTitles = ['47'];

var relevantReports = _.filter(myReports, function(report) {
  return _.contains(relevantTitles, report['title']);
});

_.each(relevantReports, function(report) {
  console.log(report);
});
