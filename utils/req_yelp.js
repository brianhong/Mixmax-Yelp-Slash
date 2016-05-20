// Used for accessing Yelp API
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var qs = require('querystring');
var _ = require('underscore');
var request = require('request');

// Make call to Yelp API
var search_yelp = function(set_parameters, callback){
  var httpMethod = 'GET';
  var url = "https://api.yelp.com/v2/search/";
  
  var default_parameters = {
    location: 'San Francisco',
    sort: '0'
  };
  
  var required_parameters = {
    oauth_consumer_key: 'HuKWhLutfdHc3C56WQ66dA',
    oauth_token: 'NHT6ABmVZvivSa6A4kH4po6BNo9MeaqS',
    oauth_nonce: n(),
    oauth_timestamp: n().toString().substr(0,10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };
  
  // Combine all parameters in order of importance
  var parameters = _.extend(default_parameters, set_parameters, required_parameters);
  
  var consumerSecret = 'MMbvTV2XNgXTZbxLJwQ_Lnwd7cs';
  var tokenSecret = '5eN9pczw0-mhrNm-Ny5VAU1fNAk';
  
  // Call Yelp's Oauth server, returned signature good for 300 secs after oauth_timestamp
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, 
                                          {encodeSignature: false});
                                          
  parameters.oauth_signature = signature;
  
  /* 
    - Turn parameters object into query string
    - Add query string to url
  */
  var paramURL = qs.stringify(parameters);
  var apiURL = url + '?' + paramURL;
  
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });
};


var business_yelp = function(set_parameters, callback){
  var httpMethod = 'GET';
  var url = "https://api.yelp.com/v2/business/" + encodeURIComponent(set_parameters.id);
  
  var required_parameters = {
    oauth_consumer_key: 'HuKWhLutfdHc3C56WQ66dA',
    oauth_token: 'NHT6ABmVZvivSa6A4kH4po6BNo9MeaqS',
    oauth_nonce: n(),
    oauth_timestamp: n().toString().substr(0,10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };
  
  // Set secrets
  var consumerSecret = 'MMbvTV2XNgXTZbxLJwQ_Lnwd7cs';
  var tokenSecret = '5eN9pczw0-mhrNm-Ny5VAU1fNAk';
  
  // Call Yelp's Oauth server, returned signature good for 300 secs after oauth_timestamp
  var parameters = _.extend(set_parameters, required_parameters);
  
  var ordered_params_str = JSON.stringify(required_parameters, ["oauth_consumer_key", "oauth_nonce", "oauth_signature_method", "oauth_timestamp", "oauth_token", "oauth_version"]);
  var ordered_params = JSON.parse(ordered_params_str);
  var signature = oauthSignature.generate(httpMethod, url, ordered_params, consumerSecret, tokenSecret, 
                                          {encodeSignature: false});
  ordered_params.oauth_signature = signature;
  
  var apiURL = url + '?' + qs.stringify(ordered_params); 

  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });
};

module.exports.search_yelp = search_yelp;
module.exports.business_yelp = business_yelp;