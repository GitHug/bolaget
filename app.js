const http = require('http'),
  https = require('https'),
  xml2js = require('xml2js');

module.exports = {
  asXML: asXML,
  asJSON: asJSON
};

/**
 * Definition of the request callback
 * @callback requestCallback
 * @param {string} data - The data returned
 * @param {string} error - Error message
 */

/**
 * Gets the Systembolaget API as XML.
 *
 * @callback {requestCallback} callback - The callback that handles the response
 */
function asXML(callback) {
  getBolagetXML((xml) => {
    callback(xml);
  });
}

/**
 * Gets the Systembolaget API as JSON.
 *
 * @callback {requestCallback} callback - The callback that handles the response
 */
function asJSON(callback) {
  asXML((xml) => {
    xml2js.parseString(xml, function(err, result) {
        callback(JSON.stringify(result), err);
    });
  });
}

/**
 * Gets the XML available at:
 * https://www.systembolaget.se/api/assortment/products/xml
 * @private
 * @callback {requestCallback} callback - The callback that handles the response
 */
function getBolagetXML(callback) {
  https.get('https://www.systembolaget.se/api/assortment/products/xml', (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
    } else if (!/^application\/xml/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.log(error.message);

      // consume response data to free up memory
      res.resume();
      callback({}, error);
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);

    res.on('end', () => {
      try {
        callback(rawData);
      }  catch (e) {
        console.log(e.message);
        callback({}, e);
      }
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
    callback({}, e);
    throw e;
  }).end();
}
