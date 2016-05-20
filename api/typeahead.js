var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var search_yelp = require('../utils/req_yelp');

// The Type Ahead API.
module.exports = function(req, res) {
  var search_term = req.query.text.trim();
  if (!search_term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  var response;
  try {
    response = sync.await(search_yelp.search_yelp({
      term: search_term,
      limit: 10,
      json: true
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  if (response.statusCode !== 200 || !response.body){
    res.status(500).send('Error');
    return;
  }

var responseObj = JSON.parse(response.body).businesses; 
var results = _.chain(responseObj)
    // Each business in the array of businesses, filter out only image_url
    .each(function(business){
      _.reject(business, function(business){
        return !business || !business.image_url;
      })
    })
    .map(function(business) {
      return {
        title: '<img style="height:75px" src="' + business.image_url + '">',
        text: 'http://yelp.com/biz/' + business.id
      };
    })
    .value();

  if (results.length === 0) {
    res.json([{
      title: '<i>(no results)</i>',
      text: ''
    }]);
  } else {
    res.json(results);
  }
};
