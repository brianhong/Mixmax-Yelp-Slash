var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var business_yelp = require('../utils/req_yelp');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();

  if (/^http:\/\/yelp\.com\/biz\/\S+/.test(term)) {
    // Special-case: handle strings in the special URL form that are suggested by the /typeahead API
    handleIdString(term.replace(/^http:\/\/yelp\.com\/biz\//, ''), req, res);
  }
};

function handleIdString(id, req, res) {
  var response;
  try {
    response = sync.await(business_yelp.business_yelp({
      id: id
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var url = JSON.parse(response.body).url;
  var responseObj = JSON.parse(response.body);
  var outerTable = '<table><a href=\'' + url + '\' style=\'text-decoration: none\'>' + responseObj.name + '</a></td></tr>';
  var html = outerTable + '<table><tr><td><img src=\'' + responseObj.image_url + '\'></td><td><img src=\'' + responseObj.rating_img_url_large + '\'></td></tr>' + '</table>';
  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
}